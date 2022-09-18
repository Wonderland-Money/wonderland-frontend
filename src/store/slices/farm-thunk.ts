import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddresses, Networks } from "../../constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { info, success, warning } from "./messages-slice";
import { messages } from "../../constants/messages";
import { ethers } from "ethers";
import { wMemoTokenContract, FarmContract } from "../../abi";
import { getGasPrice } from "../../helpers/get-gas-price";
import { clearPendingTxn, fetchPendingTxns, getFarmStakingTypeText } from "./pending-txns-slice";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";
import { calculateUserRewardDetails, getBalances, getStaking } from "./account-slice";

export interface IChangeApproval {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeApproval = createAsyncThunk("farm/changeApproval", async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const wMemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        approveTx = await wMemoContract.approve(addresses.FARM_ADDRESS, ethers.constants.MaxUint256, { gasPrice });

        const text = "Approve Farm";
        const pendingTxnType = "approve_farm";

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

    dispatch(getStaking({ address, networkID, provider }));

    return;
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeStake = createAsyncThunk("farm/changeStake", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const farmContract = new ethers.Contract(addresses.FARM_ADDRESS, FarmContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "stake") {
            stakeTx = await farmContract.stake(ethers.utils.parseEther(value), { gasPrice });
        } else {
            stakeTx = await farmContract.withdraw(ethers.utils.parseEther(value), { gasPrice });
        }
        const pendingTxnType = action === "stake" ? "farm_staking" : "farm_unstaking";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getFarmStakingTypeText(action), type: pendingTxnType }));
        await stakeTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    await dispatch(calculateUserRewardDetails({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});

interface IGetReward {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const getReward = createAsyncThunk("farm/getReward", async ({ provider, networkID, address }: IGetReward, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const farmContract = new ethers.Contract(addresses.FARM_ADDRESS, FarmContract, signer);

    let rewardTx;

    try {
        const gasPrice = await getGasPrice(provider);

        rewardTx = await farmContract.getReward({ gasPrice });

        dispatch(fetchPendingTxns({ txnHash: rewardTx.hash, text: "Farm Harvest", type: "farm_harvest" }));
        await rewardTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (rewardTx) {
            dispatch(clearPendingTxn(rewardTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(calculateUserRewardDetails({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
