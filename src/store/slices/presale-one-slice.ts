import { ethers, constants, Contract } from "ethers";
import { getBalances } from "./account-slice";
import { getAddresses } from "../../constants";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { PresaleContract } from "../../abi/index";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";
import { error, warning, success, info } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { frax } from "src/helpers/bond";
import { prettyVestingPeriod } from "../../helpers";
import { setAll } from "../../helpers";

interface IGetPresaleOneDetails {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export interface IPresaleOneDetails {
    contract: string | undefined;
    claimablePsi: string | undefined;
    amountBuyable: string | undefined;
    claimedPsi: string | undefined;
    vestingStart: string | undefined;
    vestingTerm: string | undefined;
    psiPrice: number | undefined;
    allowanceVal: number | undefined;
    balanceVal: number | undefined;
}

export const getPresaleOneDetails = createAsyncThunk("presaleOne/getPresaleOneDetails", async ({ provider, networkID, address }: IGetPresaleOneDetails, { dispatch }) => {
    let claimablePsi = "",
        amountBuyable = "",
        claimedPsi = "",
        vestingStart = "",
        vestingTerm = "",
        psiPrice = 0;

    const addresses = getAddresses(networkID);
    let approvedContractAddress = "";
    let isApproved = false;

    let phase1Contract = new Contract(addresses.presaleContributor, PresaleContract, provider);
    let term = await phase1Contract.terms(address);
    if (term.whitelistedAmount > 0) {
        approvedContractAddress = addresses.presaleContributor;
        isApproved = true;
    }

    let approvedContract = new Contract(approvedContractAddress, PresaleContract, provider);
    claimablePsi = await approvedContract.claimableFor(address);
    amountBuyable = await approvedContract.buyableFor(address);
    claimedPsi = await approvedContract.claimed(address);

    const vestingStartBlock = await approvedContract.vestingStart();
    const vestingTermBlock = await approvedContract.vestingPeriod();
    psiPrice = await approvedContract.pricePerBase();

    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    claimablePsi = ethers.utils.formatUnits(claimablePsi, 9);
    amountBuyable = ethers.utils.formatEther(amountBuyable);
    claimedPsi = ethers.utils.formatUnits(claimedPsi, 9);

    vestingStart = prettyVestingPeriod(currentBlock, vestingStartBlock);
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
        vestingStart,
        vestingTerm,
        psiPrice,
        allowanceVal,
        balanceVal,
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

interface IBuyPresaleOne {
    value: string;
    presaleAddress: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const buyPresaleOne = createAsyncThunk("presaleOne/buyPresaleOne", async ({ value, presaleAddress, provider }: IBuyPresaleOne, { dispatch }) => {
    const valueInWei = ethers.utils.parseUnits(value.toString(), 18);

    const signer = provider.getSigner();
    const presale = new Contract(presaleAddress, PresaleContract, signer);

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

interface IClaimPresaleOne {
    address: string;
    presaleAddress: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    stake: boolean;
}

export const claimPresaleOne = createAsyncThunk("presaleOne/claimPresaleOne", async ({ address, presaleAddress, networkID, provider, stake }: IClaimPresaleOne, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const presale = new Contract(presaleAddress, PresaleContract, signer);

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
});

export interface IPresaleOneSlice {
    loading: boolean;
    approvedContractAddress: string;
    claimablePsi: number;
    amountBuyable: string;
    claimedPsi: number;
    vestingStart: string;
    vestingTerm: string;
    psiPrice: number;
    allowanceVal: number;
    balanceVal: number;
}

const initialState: IPresaleOneSlice = {
    loading: true,
    approvedContractAddress: "",
    claimablePsi: 0,
    amountBuyable: "",
    claimedPsi: 0,
    vestingStart: "",
    vestingTerm: "",
    psiPrice: 0,
    allowanceVal: 0,
    balanceVal: 0,
};

const presaleOneSlice = createSlice({
    name: "presaleOne",
    initialState,
    reducers: {
        fetchPresaleSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getPresaleOneDetails.pending, state => {
                state.loading = true;
            })
            .addCase(getPresaleOneDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getPresaleOneDetails.rejected, (state, { error }) => {
                state.loading = false;
                //console.log(error);
            });
    },
});

export default presaleOneSlice.reducer;

export const { fetchPresaleSuccess } = presaleOneSlice.actions;

const baseInfo = (state: RootState) => state.presaleOne;

export const getPresaleOneState = createSelector(baseInfo, claiming => claiming);
