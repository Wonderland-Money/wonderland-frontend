import { ethers, constants, Contract } from "ethers";
import { calculateUserBondDetails, getBalances } from "./account-slice";
import { getAddresses } from "../../constants";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { fetchAccountSuccess } from "./account-slice";
import { PresaleOpenContract } from "../../abi/index";
import { Networks } from "../../constants/blockchain";
import { getBondCalculator } from "../../helpers/bond-calculator";
import { RootState } from "../store";
import { error, warning, success, info } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { ust, frax } from "src/helpers/bond";
import { trim, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { setAll } from "../../helpers";

interface IGetPresaleFourDetails {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export interface IPresaleFourDetails {
    contract: string;
    claimablePsi: string;
    amountBuyable: string;
    claimedPsi: string;
    vestingRemaining: string;
    vestingTerm: string;
    psiPrice: number;
    allowanceVal: number;
    balanceVal: number;
    boughtAmount: string;
}

export const getPresaleFourDetails = createAsyncThunk("presaleFour/getPresaleFourDetails", async ({ provider, networkID, address }: IGetPresaleFourDetails, { dispatch }) => {
    let claimablePsi = "",
        amountBuyable = "",
        claimedPsi = "",
        vestingRemaining = "",
        vestingTerm = "",
        boughtAmount = "",
        psiPrice = 0;

    const addresses = getAddresses(networkID);
    const approvedContractAddress = addresses.presalePhase3;
    let approvedContract = new Contract(approvedContractAddress, PresaleOpenContract, provider);
    claimablePsi = await approvedContract.claimableFor(address);
    amountBuyable = await approvedContract.buyableFor(address);
    claimedPsi = await approvedContract.claimed(address);

    const term = await approvedContract.terms(address);

    const vestingStartBlock = term.boughtAt;
    const vestingTermBlock = await approvedContract.vestingPeriod();
    psiPrice = await approvedContract.pricePerBase();
    boughtAmount = term.boughtAmount;
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    claimablePsi = ethers.utils.formatUnits(claimablePsi, 9);
    amountBuyable = ethers.utils.formatEther(amountBuyable);
    claimedPsi = ethers.utils.formatUnits(claimedPsi, 9);
    boughtAmount = ethers.utils.formatUnits(boughtAmount, 9);

    if(ethers.utils.formatUnits(vestingStartBlock) != "0.0") {
        vestingRemaining = prettyVestingPeriod(currentBlock, vestingStartBlock.add(vestingTermBlock));
    } else {
        vestingRemaining = "Not Yet Purchased";
    }
    vestingTerm = prettyVestingPeriod(vestingStartBlock, vestingStartBlock.add(vestingTermBlock));

    const signer = provider.getSigner();
    const reserveContract = frax.getContractForReserve(networkID, signer);
    const allowance = await reserveContract.allowance(address, approvedContractAddress);
    const balance = await reserveContract.balanceOf(address);

    const allowanceVal = ethers.utils.formatEther(allowance);
    const balanceVal = ethers.utils.formatEther(balance);

    return {
        approvedContractAddress,
        claimablePsi,
        amountBuyable,
        claimedPsi,
        vestingRemaining,
        vestingTerm,
        psiPrice,
        allowanceVal,
        balanceVal,
        boughtAmount
    };
});

interface IChangeApproval {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    presaleAddress: string;
    address: string;
}

export interface allowanceDetails {
    allowance: number;
    balance: number;
}

export const changeApproval = createAsyncThunk("bonding/changeApproval", async ({ provider, networkID, presaleAddress, address }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const reserveContract = frax.getContractForReserve(networkID, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);
        approveTx = await reserveContract.approve(presaleAddress, constants.MaxUint256, { gasPrice });
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text: "Approving",
                type: "approving",
            }),
        );
        dispatch(success({ text: messages.tx_successfully_send }));
        await approveTx.wait();
    } catch (err: any) {
        dispatch(error({ text: messages.something_wrong, error: err }));
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, presaleAddress);
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    return {
        allowance,
        balanceVal,
    };
});

interface IBuyPresaleFour {
    value: string;
    presaleAddress: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const buyPresaleFour = createAsyncThunk("presaleFour/buyPresaleFour", async ({ value, presaleAddress, provider }: IBuyPresaleFour, { dispatch }) => {
    const valueInWei = ethers.utils.parseUnits(value.toString(), 18);

    const signer = provider.getSigner();
    const presale = new Contract(presaleAddress, PresaleOpenContract, signer);

    let presaleTx;
    try {
        const gasPrice = await getGasPrice(provider);
        presaleTx = await presale.buy(valueInWei, { gasPrice });
        dispatch(
            fetchPendingTxns({
                txnHash: presaleTx.hash,
                text: "Purchasing from presale ",
                type: "presale",
            }),
        );
        dispatch(success({ text: messages.tx_successfully_send }));
        await presaleTx.wait();
        dispatch(info({ text: messages.your_balance_updated }));
        return;
    } catch (err: any) {
        if (err.code === -32603 && err.message.indexOf("ds-math-sub-underflow") >= 0) {
            dispatch(error({ text: "You may be trying to purchase more than your balance! Error code: 32603. Message: ds-math-sub-underflow", error: err }));
        } else if (err.code === -32603 && err.data && err.data.message) {
            const msg = err.data.message.includes(":") ? err.data.message.split(":")[1].trim() : err.data.data || err.data.message;
            dispatch(error({ text: msg, error: err }));
        } else dispatch(error({ text: messages.something_wrong, error: err }));
        return;
    } finally {
        if (presaleTx) {
            dispatch(clearPendingTxn(presaleTx.hash));
        }
    }
});

interface IClaimPresaleFour {
    address: string;
    presaleAddress: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    stake: boolean;
}

export const claimPresaleFour = createAsyncThunk(
    "presaleFour/claimPresaleFour",
    async ({ address, presaleAddress, networkID, provider, stake }: IClaimPresaleFour, { dispatch }) => {
        if (!provider) {
            dispatch(warning({ text: messages.please_connect_wallet }));
            return;
        }

        const signer = provider.getSigner();
        const presale = new Contract(presaleAddress, PresaleOpenContract, signer);

        let claimTx;
        try {
            const gasPrice = await getGasPrice(provider);

            const claimablePsi = await presale.claimableFor(address);
            if (stake) {
                claimTx = await presale.stake(claimablePsi, { gasPrice });
                dispatch(
                    fetchPendingTxns({
                        txnHash: claimTx.hash,
                        text: "Claiming PSI",
                        type: "claiming",
                    }),
                );
            } else {
                claimTx = await presale.claim(claimablePsi, { gasPrice });
                console.log("CLAIMTX: ", claimTx.hash);
                dispatch(
                    fetchPendingTxns({
                        txnHash: claimTx.hash,
                        text: "Claiming PSI",
                        type: "claiming",
                    }),
                );
            }
            dispatch(success({ text: messages.tx_successfully_send }));
            await claimTx.wait();
            dispatch(getBalances({ address, networkID, provider }));
            dispatch(info({ text: messages.your_balance_updated }));
            return;
        } catch (err: any) {
            dispatch(error({ text: messages.something_wrong, error: err.message }));
        } finally {
            if (claimTx) {
                dispatch(clearPendingTxn(claimTx.hash));
            }
        }
    },
);

export interface IPresaleFourSlice {
    loading: boolean;
    approvedContractAddress: string;
    claimablePsi: number;
    amountBuyable: string;
    claimedPsi: number;
    vestingRemaining: string;
    vestingTerm: string;
    psiPrice: number;
    allowanceVal: number;
    balanceVal: number;
    boughtAmount: number;
}

const initialState: IPresaleFourSlice = {
    loading: true,
    approvedContractAddress: "",
    claimablePsi: 0,
    amountBuyable: "",
    claimedPsi: 0,
    vestingRemaining: "",
    vestingTerm: "",
    psiPrice: 0,
    allowanceVal: 0,
    balanceVal: 0,
    boughtAmount: 0
};

const presaleFourSlice = createSlice({
    name: "presaleFour",
    initialState,
    reducers: {
        fetchPresaleSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getPresaleFourDetails.pending, state => {
                state.loading = true;
            })
            .addCase(getPresaleFourDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getPresaleFourDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default presaleFourSlice.reducer;

export const { fetchPresaleSuccess } = presaleFourSlice.actions;

const baseInfo = (state: RootState) => state.presaleFour;

export const getPresaleFourState = createSelector(baseInfo, claiming => claiming);
