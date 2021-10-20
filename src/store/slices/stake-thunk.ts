import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, TimeTokenContract, MemoTokenContract, StakingContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";

interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, signer);
    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "time") {
            approveTx = await timeContract.approve(addresses.STAKING_HELPER_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        if (token === "memo") {
            approveTx = await memoContract.approve(addresses.STAKING_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = "Approve " + (token === "time" ? "Staking" : "Unstaking");
        const pendingTxnType = token === "time" ? "approve_staking" : "approve_unstaking";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await approveTx.wait();
    } catch (err: any) {
        dispatch(error({ text: messages.something_wrong, error: err.message }));
        return;
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    const stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            staking: {
                timeStake: Number(stakeAllowance),
                memoUnstake: Number(unstakeAllowance),
            },
        }),
    );
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeStake = createAsyncThunk("stake/changeStake", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "stake") {
            stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address, { gasPrice });
        } else {
            stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
        }
        const pendingTxnType = action === "stake" ? "staking" : "unstaking";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await stakeTx.wait();
    } catch (err: any) {
        if (err.code === -32603 && err.message.indexOf("ds-math-sub-underflow") >= 0) {
            dispatch(error({ text: "You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow", error: err }));
        } else {
            dispatch(error({ text: messages.something_wrong, error: err }));
        }
        return;
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
