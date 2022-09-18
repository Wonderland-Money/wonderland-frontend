import { ethers, constants } from "ethers";
import { getMarketPrice, getTokenPrice, sleep, trim } from "../../helpers";
import { calculateUserBondDetails, getBalances } from "./account-slice";
import { getAddresses } from "../../constants";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { fetchAccountSuccess } from "./account-slice";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import { getBondCalculator } from "../../helpers/bond-calculator";
import { RootState } from "../store";
import { avaxTime, wmemoMim } from "../../helpers/bond";
import { error, warning, success, info } from "../slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { BigNumber } from "ethers";
import { CustomTreasuryContract, wMemoTokenContract } from "../../abi";

interface IChangeApproval {
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeApproval = createAsyncThunk("bonding/changeApproval", async ({ bond, provider, networkID, address }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserve(networkID, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);
        const bondAddr = bond.getAddressForBond(networkID);
        approveTx = await reserveContract.approve(bondAddr, constants.MaxUint256, { gasPrice });
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text: "Approving " + bond.displayName,
                type: "approve_" + bond.name,
            }),
        );
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    let allowance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));

    return dispatch(
        fetchAccountSuccess({
            bonds: {
                [bond.name]: {
                    allowance: Number(allowance),
                },
            },
        }),
    );
});

interface ICalcBondDetails {
    bond: Bond;
    value: string | null;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IBondDetails {
    bond: string;
    bondDiscount: number;
    bondQuote: number;
    bondQuoteWrapped?: number;
    purchased: number;
    vestingTerm: number;
    maxBondPrice: number;
    maxBondPriceWrapped?: number;
    bondPrice: number;
    marketPrice: number;
    maxBondPriceToken: number;
    soldOut?: boolean;
}

export const calcBondDetails = createAsyncThunk("bonding/calcBondDetails", async ({ bond, value, provider, networkID }: ICalcBondDetails, { dispatch }) => {
    if (!value) {
        value = "0";
    }

    const amountInWei = ethers.utils.parseEther(value);

    let bondPrice = 0,
        bondDiscount = 0,
        valuation = 0,
        bondQuote = 0,
        bondQuoteWrapped = 0;

    const addresses = getAddresses(networkID);

    const bondContract = bond.getContractForBond(networkID, provider);
    const bondCalcContract = getBondCalculator(networkID, provider);
    const wMemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);

    const terms = await bondContract.terms();
    let maxBondPrice = await bondContract.maxPayout();
    const maxBondPriceWrapped = (await wMemoContract.MEMOTowMEMO(maxBondPrice)) / Math.pow(10, 18);

    maxBondPrice = maxBondPrice / Math.pow(10, 9);

    const { timePrice, wMemoPrice } = await getMarketPrice();

    let marketPrice = timePrice * Math.pow(10, 9);

    const mimPrice = getTokenPrice("MIM");
    marketPrice = (marketPrice / Math.pow(10, 9)) * mimPrice;

    try {
        bondPrice = await bondContract.bondPriceInUSD();

        if (bond.name === avaxTime.name) {
            const avaxPrice = getTokenPrice("AVAX");
            bondPrice = bondPrice * avaxPrice;
        }

        bondDiscount = (marketPrice * Math.pow(10, 18) - bondPrice) / bondPrice;
    } catch (e) {
        console.log("error getting bondPriceInUSD", e);
    }

    let maxBondPriceToken = 0;
    const maxBodValue = ethers.utils.parseEther("1");

    if (bond.isLP) {
        if (!bond.deprecated) {
            valuation = await bondCalcContract.valuation(bond.getAddressForReserve(networkID), amountInWei);
            bondQuote = await bondContract.payoutFor(valuation);
            bondQuoteWrapped = (await wMemoContract.MEMOTowMEMO(bondQuote)) / Math.pow(10, 18);
            bondQuote = bondQuote / Math.pow(10, 9);

            const maxValuation = await bondCalcContract.valuation(bond.getAddressForReserve(networkID), maxBodValue);
            const maxBondQuote = await bondContract.payoutFor(maxValuation);
            maxBondPriceToken = maxBondPrice / (maxBondQuote * Math.pow(10, -9));
        }
    } else {
        if (!bond.deprecated) {
            bondQuote = await bondContract.payoutFor(amountInWei);
            bondQuoteWrapped = (await wMemoContract.MEMOTowMEMO(parseInt(trim(bondQuote / Math.pow(10, 9), 0)))) / Math.pow(10, 18);
            bondQuote = bondQuote / Math.pow(10, 18);

            const maxBondQuote = await bondContract.payoutFor(maxBodValue);
            maxBondPriceToken = maxBondPrice / (maxBondQuote * Math.pow(10, -18));
        }
    }

    if (!!value && bondQuote > maxBondPrice && !bond.deprecated) {
        dispatch(error({ text: messages.try_mint_more(maxBondPrice.toFixed(2).toString()) }));
    }

    // Calculate bonds purchased
    const token = bond.getContractForReserve(networkID, provider);
    let purchased = await token.balanceOf(addresses.TREASURY_ADDRESS);

    if (bond.tokensInStrategy) {
        purchased = BigNumber.from(purchased).add(BigNumber.from(bond.tokensInStrategy)).toString();
    }

    if (bond.isLP) {
        const assetAddress = bond.getAddressForReserve(networkID);
        const markdown = await bondCalcContract.markdown(assetAddress);
        purchased = await bondCalcContract.valuation(assetAddress, purchased);
        purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));

        if (bond.customToken) {
            const tokenPrice = getTokenPrice(bond.bondToken);
            purchased = purchased * tokenPrice;
        }

        if (bond.name === wmemoMim.name) {
            purchased = purchased * wMemoPrice * mimPrice;
        }
    } else {
        purchased = purchased / Math.pow(10, 18);

        if (bond.customToken) {
            const tokenPrice = getTokenPrice(bond.bondToken);
            purchased = purchased * tokenPrice;
        }
    }

    return {
        bond: bond.name,
        bondDiscount,
        bondQuote,
        purchased,
        vestingTerm: Number(terms.vestingTerm),
        maxBondPrice,
        bondPrice: bondPrice / Math.pow(10, 18),
        marketPrice,
        maxBondPriceToken,
        bondQuoteWrapped,
        maxBondPriceWrapped,
    };
});

async function calcPayoutFor(value: string, customTreasury: ethers.Contract, bondContract: ethers.Contract) {
    const token = await bondContract.principalToken();
    const tokensValue = await customTreasury.valueOfToken(token, value);
    const payoutFor = await bondContract.payoutFor(tokensValue);
    return payoutFor / Math.pow(10, 18);
}

export const calcBondV2Details = createAsyncThunk("bonding/calcBondV2Details", async ({ bond, value, provider, networkID }: ICalcBondDetails, { dispatch }) => {
    if (!value) {
        value = "0";
    }
    const amountInWei = ethers.utils.parseEther(value);

    let bondPrice = 0,
        bondDiscount = 0,
        bondQuote = 0,
        maxBondPriceToken = 0;

    const addresses = getAddresses(networkID);

    const bondContract = bond.getContractForBond(networkID, provider);
    const customTreasury = new ethers.Contract(addresses.TREASURY_ADDRESS, CustomTreasuryContract, provider);

    const terms = await bondContract.terms();
    let maxBondPrice = (await bondContract.maxPayout()) / Math.pow(10, 18);

    const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    const treasutyBalance = (await wmemoContract.balanceOf(addresses.TREASURY_ADDRESS)) / Math.pow(10, 18);

    maxBondPrice = treasutyBalance > maxBondPrice ? maxBondPrice : treasutyBalance;

    let { wMemoPrice } = await getMarketPrice();

    const mimPrice = getTokenPrice("MIM");

    const maxBodValue = ethers.utils.parseEther("1");
    const bondValue = ethers.utils.parseEther("1000");

    try {
        if (!bond.deprecated) {
            bondQuote = await calcPayoutFor(amountInWei.toString(), customTreasury, bondContract);

            const payoutForMax = await calcPayoutFor(maxBodValue.toString(), customTreasury, bondContract);
            maxBondPriceToken = maxBondPrice / payoutForMax;
        }

        bondPrice = (await bondContract.bondPrice()) / Math.pow(10, 7);
        const stablePayoutFor = await calcPayoutFor(bondValue.toString(), customTreasury, bondContract);
        const payoutForUsd = stablePayoutFor * wMemoPrice;
        bondDiscount = (payoutForUsd - 1000) / 1000;
    } catch (e) {
        console.log("error getting bondPriceInUSD", e);
    }

    let purchased = await bondContract.totalPrincipalBonded();
    purchased = Number(ethers.utils.formatEther(purchased)) * mimPrice;

    const soldOut = treasutyBalance < 0.00001;

    return {
        bond: bond.name,
        bondDiscount,
        bondPrice,
        purchased,
        bondQuote,
        vestingTerm: Number(terms.vestingTerm),
        maxBondPrice,
        marketPrice: wMemoPrice,
        maxBondPriceToken,
        soldOut,
    };
});

interface IBondAsset {
    value: string;
    address: string;
    bond: Bond;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    slippage: number;
    useAvax: boolean;
}
export const bondAsset = createAsyncThunk("bonding/bondAsset", async ({ value, address, bond, networkID, provider, slippage, useAvax }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005;
    const valueInWei = ethers.utils.parseUnits(value, "ether");
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    let bondTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (useAvax) {
            bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress, { value: valueInWei, gasPrice });
        } else {
            bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress, { gasPrice });
        }
        dispatch(
            fetchPendingTxns({
                txnHash: bondTx.hash,
                text: "Bonding " + bond.displayName,
                type: "bond_" + bond.name,
            }),
        );
        await bondTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
        dispatch(info({ text: messages.your_balance_update_soon }));
        await sleep(10);
        await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
        dispatch(info({ text: messages.your_balance_updated }));
        return;
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (bondTx) {
            dispatch(clearPendingTxn(bondTx.hash));
        }
    }
});

interface IRedeemBond {
    address: string;
    bond: Bond;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    autostake: boolean;
}

export const redeemBond = createAsyncThunk("bonding/redeemBond", async ({ address, bond, networkID, provider, autostake }: IRedeemBond, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    let redeemTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (bond.v2Bond) {
            redeemTx = await bondContract.redeem(address, { gasPrice });
        } else {
            redeemTx = await bondContract.redeem(address, autostake === true, { gasPrice });
        }

        const pendingTxnType = "redeem_bond_" + bond.name + (autostake === true ? "_autostake" : "");
        dispatch(
            fetchPendingTxns({
                txnHash: redeemTx.hash,
                text: "Redeeming " + bond.displayName,
                type: pendingTxnType,
            }),
        );
        await redeemTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
        await sleep(0.01);
        dispatch(info({ text: messages.your_balance_update_soon }));
        await sleep(10);
        await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
        await dispatch(getBalances({ address, networkID, provider }));
        dispatch(info({ text: messages.your_balance_updated }));
        return;
    } catch (err: any) {
        metamaskErrorWrap(err, dispatch);
    } finally {
        if (redeemTx) {
            dispatch(clearPendingTxn(redeemTx.hash));
        }
    }
});

export interface IBondSlice {
    loading: boolean;
    [key: string]: any;
}

const initialState: IBondSlice = {
    loading: true,
};

const setBondState = (state: IBondSlice, payload: any) => {
    const bond = payload.bond;
    const newState = { ...state[bond], ...payload };
    state[bond] = newState;
    state.loading = false;
};

const bondingSlice = createSlice({
    name: "bonding",
    initialState,
    reducers: {
        fetchBondSuccess(state, action) {
            state[action.payload.bond] = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(calcBondDetails.pending, state => {
                state.loading = true;
            })
            .addCase(calcBondDetails.fulfilled, (state, action) => {
                setBondState(state, action.payload);
                state.loading = false;
            })
            .addCase(calcBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calcBondV2Details.pending, state => {
                state.loading = true;
            })
            .addCase(calcBondV2Details.fulfilled, (state, action) => {
                setBondState(state, action.payload);
                state.loading = false;
            })
            .addCase(calcBondV2Details.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: RootState) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
