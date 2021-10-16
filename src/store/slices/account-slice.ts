import { ethers } from "ethers";
import { BONDS, getAddresses } from "../../constants";
import { MimTokenContract, TimeTokenContract, MemoTokenContract } from "../../abi/";
import { contractForBond, contractForReserve, setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IAccountProps {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IUserBindDetails {
  bond: string;
  allowance: number;
  balance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string;
  avaxBalance: number;
}

export interface IAccount {
  balances: {
    mim: string;
    memo: string;
    time: string;
  };
  staking: {
    timeStake: number;
    memoUnstake: number;
  };
  mim: IUserBindDetails;
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IAccountProps) => {
    const addresses = getAddresses(networkID);
    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
    const memoBalance = await memoContract.balanceOf(address);
    const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
    const timeBalance = await timeContract.balanceOf(address);
    return {
      balances: {
        memo: ethers.utils.formatUnits(memoBalance, "gwei"),
        time: ethers.utils.formatUnits(timeBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IAccountProps) => {
    let timeBalance = 0;
    let memoBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    const mimContract = new ethers.Contract(addresses.MIM_ADDRESS, MimTokenContract, provider);
    const mimBalance = await mimContract.balanceOf(address);

    if (addresses.TIME_ADDRESS) {
      const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
      timeBalance = await timeContract.balanceOf(address);
      stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.MEMO_ADDRESS) {
      const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
      memoBalance = await memoContract.balanceOf(address);
      unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS);
    }

    return {
      balances: {
        memo: ethers.utils.formatUnits(memoBalance, "gwei"),
        time: ethers.utils.formatUnits(timeBalance, "gwei"),
        mim: ethers.utils.formatEther(mimBalance),
      },
      staking: {
        timeStake: +stakeAllowance,
        memoUnstake: +unstakeAllowance,
      },
    };
  },
);

interface ICalculateUserBondDetails {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  "bonding/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalculateUserBondDetails) => {
    if (!address) return;

    const addresses = getAddresses(networkID);
    const bondContract = contractForBond(bond, networkID, provider);
    const reserveContract = contractForReserve(bond, networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastTime;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = "0";

    if (bond === BONDS.mim) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MIM);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.mim_time) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MIM_TIME);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    }

    if (bond === BONDS.avax_time) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.AVAX_TIME);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    }

    if (bond === BONDS.wavax) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.WAVAX);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    const avaxBalance = await provider.getSigner().getBalance();

    return {
      bond,
      allowance: Number(allowance),
      balance: Number(balance),
      avaxBalance: Number(ethers.utils.formatEther(avaxBalance)),
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.status = "loading";
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.status = "idle";
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.status = "loading";
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.status = "idle";
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        //@ts-ignore
        const bond = action.payload.bond;
        state[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
