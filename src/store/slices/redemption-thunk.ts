import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { wMemoTokenContract } from "src/abi";
import { getAddresses, Networks } from "src/constants";
import { messages } from "src/constants/messages";
import { sleep } from "src/helpers";
import { getGasPrice } from "src/helpers/get-gas-price";
import { metamaskErrorWrap } from "src/helpers/metamask-error-wrap";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { info, success, warning } from "./messages-slice";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { MemoExchangeAbi } from "src/abi";
import axios from "axios";

export interface IChangeApproval {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeApproval = createAsyncThunk("redemption/changeApproval", async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        approveTx = await wmemoContract.approve(addresses.REDEMPTION_ADDRESS, ethers.constants.MaxUint256, { gasPrice });

        const text = "Approve Redemption";
        const pendingTxnType = "approve_redemption";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const wmemoAllowance = await wmemoContract.allowance(address, addresses.REDEMPTION_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            redemption: {
                wmemo: Number(wmemoAllowance),
            },
        }),
    );
});

export interface IChangeSwap {
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeSwap = createAsyncThunk("redemption/changeSwap", async ({ value, provider, networkID, address }: IChangeSwap, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const amountInWei = ethers.utils.parseEther(value);
    const redemptionContract = new ethers.Contract(addresses.REDEMPTION_ADDRESS, MemoExchangeAbi, signer);
    const { amount, proof } = (await axios.get(`https://analytics.back.popsicle.finance/api/v1/memoexchange?account=${address}`)).data;

    let swapTx;

    try {
        const gasPrice = await getGasPrice(provider);
        swapTx = await redemptionContract.exchangeForAssets(amountInWei, address, amount, proof, { gasPrice });

        const pendingTxnType = "redemption";
        dispatch(fetchPendingTxns({ txnHash: swapTx.hash, text: "Redemption", type: pendingTxnType }));
        await swapTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (swapTx) {
            dispatch(clearPendingTxn(swapTx.hash));
        }
    }

    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));

    const amountClaimed = await redemptionContract.amountClaimed(address);
    const redemptionClaim = BigNumber.from(amount).sub(amountClaimed).toString();

    return dispatch(
        fetchAccountSuccess({
            redemptionClaim: {
                avalable: ethers.utils.formatEther(redemptionClaim),
            },
        }),
    );
});
