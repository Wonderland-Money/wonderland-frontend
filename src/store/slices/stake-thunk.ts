import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, TimeTokenContract, MemoTokenContract, StakingContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider } from "@ethersproject/providers";

interface IChangeApproval {
  token: string;
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, signer);
    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, signer);

    let approveTx;
    try {
      if (token === "time") {
        approveTx = await timeContract.approve(addresses.STAKING_HELPER_ADDRESS, ethers.constants.MaxUint256);
      }

      if (token === "memo") {
        approveTx = await memoContract.approve(addresses.STAKING_ADDRESS, ethers.constants.MaxUint256);
      }

      const text = "Approve " + (token === "time" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "time" ? "approve_staking" : "approve_unstaking";

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (error: any) {
      alert(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS); //TODO

    return dispatch(
      fetchAccountSuccess({
        staking: {
          timeStake: +stakeAllowance,
          memoUnstake: +unstakeAllowance,
        },
      }),
    );
  },
);

interface IChangeStake {
  action: string;
  value: string;
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let stakeTx;

    try {
      if (action === "stake") {
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address);
      } else {
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    return;
  },
);
