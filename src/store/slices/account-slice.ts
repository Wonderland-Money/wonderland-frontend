import { ethers, BigNumber } from "ethers";
import { getAddresses } from "../../constants";
import { TimeTokenContract, MemoTokenContract, MimTokenContract, wMemoTokenContract, FarmContract, StableReserveContract, MemoExchangeAbi } from "../../abi";
import { getTokenPrice, getWmemoMarketPrice, setAll, trim } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";
import farmTokens, { EXCLUDED_TOKEN } from "../../helpers/farm-tokens";
import { rewardPerToken } from "../../helpers/rewardPerToken";
import { earned } from "../../helpers/earned";
import axios from "axios";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        memo: string;
        time: string;
        wmemo: string;
    };
    farm: {
        wmemo: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    let memoBalance = 0;
    let timeBalance = 0;
    let wmemoBalance = 0;
    let wMemoStaked = 0;

    if (addresses.MEMO_ADDRESS) {
        const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
        memoBalance = await memoContract.balanceOf(address);
    }

    if (addresses.TIME_ADDRESS) {
        const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
        timeBalance = await timeContract.balanceOf(address);
    }

    if (addresses.WMEMO_ADDRESS) {
        const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
        wmemoBalance = await wmemoContract.balanceOf(address);
    }

    if (addresses.FARM_ADDRESS) {
        const farmContract = new ethers.Contract(addresses.FARM_ADDRESS, FarmContract, provider);
        wMemoStaked = await farmContract.balanceOf(address);
    }

    return {
        balances: {
            memo: ethers.utils.formatUnits(memoBalance, "gwei"),
            time: ethers.utils.formatUnits(timeBalance, "gwei"),
            wmemo: ethers.utils.formatEther(wmemoBalance),
        },
        farm: {
            wmemo: ethers.utils.formatEther(wMemoStaked),
        },
    };
});

interface IAccountStaking {
    staking: {
        time: number;
        memo: number;
        wmemo: number;
    };
}

export const getStaking = createAsyncThunk("account/getStaking", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountStaking> => {
    const addresses = getAddresses(networkID);

    const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
    const time = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);

    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
    const memo = await memoContract.allowance(address, addresses.STAKING_ADDRESS);

    const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    const wMemo = await wmemoContract.allowance(address, addresses.FARM_ADDRESS);

    return {
        staking: {
            time: Number(time),
            memo: Number(memo),
            wmemo: Number(wMemo),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        time: string;
        memo: string;
        wmemo: string;
    };
    staking: {
        time: number;
        memo: number;
        wmemo: number;
    };
    wrapping: {
        memo: number;
    };
    bridge: {
        wmemo: number;
    };
    farm: {
        wmemo: string;
    };
    redemption: {
        wmemo: number;
    };
    redemptionClaim: {
        avalable: string;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let timeBalance = 0;
    let memoBalance = 0;

    let wmemoBalance = 0;
    let memoWmemoAllowance = 0;

    let wMemoBridgeAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    let wMemoFarmAllowance = 0;
    let wMemoStaked = 0;
    let wMemoRedemptionAllowance = 0;

    let redemptionClaim: number | string = 0;

    const addresses = getAddresses(networkID);

    if (addresses.TIME_ADDRESS) {
        const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
        timeBalance = await timeContract.balanceOf(address);
        stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.MEMO_ADDRESS) {
        const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
        memoBalance = await memoContract.balanceOf(address);
        unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.WMEMO_ADDRESS) {
            memoWmemoAllowance = await memoContract.allowance(address, addresses.WMEMO_ADDRESS);
        }
    }

    if (addresses.WMEMO_ADDRESS) {
        const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
        wmemoBalance = await wmemoContract.balanceOf(address);

        if (addresses.ANYSWAP_ADDRESS) {
            wMemoBridgeAllowance = await wmemoContract.allowance(address, addresses.ANYSWAP_ADDRESS);
        }

        if (addresses.FARM_ADDRESS) {
            wMemoFarmAllowance = await wmemoContract.allowance(address, addresses.FARM_ADDRESS);

            const farmContract = new ethers.Contract(addresses.FARM_ADDRESS, FarmContract, provider);
            wMemoStaked = await farmContract.balanceOf(address);
        }
        if (addresses.REDEMPTION_ADDRESS) {
            wMemoRedemptionAllowance = await wmemoContract.allowance(address, addresses.REDEMPTION_ADDRESS);
        }
    }

    // if (addresses.REDEMPTION_ADDRESS) {
    //     const redemptionContract = new ethers.Contract(addresses.REDEMPTION_ADDRESS, MemoExchangeAbi, provider);
    //     const amountClaimed = await redemptionContract.amountClaimed(address);
    //     try {
    //         const { amount } = (await axios.get(`https://analytics.back.popsicle.finance/api/v1/memoexchange?account=${address}`)).data;
    //         redemptionClaim = BigNumber.from(amount).sub(amountClaimed).toString();
    //     } catch (err) {}
    // }

    return {
        balances: {
            memo: ethers.utils.formatUnits(memoBalance, "gwei"),
            time: ethers.utils.formatUnits(timeBalance, "gwei"),
            wmemo: ethers.utils.formatEther(wmemoBalance),
        },
        staking: {
            time: Number(stakeAllowance),
            memo: Number(unstakeAllowance),
            wmemo: Number(wMemoFarmAllowance),
        },
        wrapping: {
            memo: Number(memoWmemoAllowance),
        },
        bridge: {
            wmemo: Number(wMemoBridgeAllowance),
        },
        farm: {
            wmemo: ethers.utils.formatEther(wMemoStaked),
        },
        redemption: {
            wmemo: Number(wMemoRedemptionAllowance),
        },
        redemptionClaim: {
            avalable: ethers.utils.formatEther(redemptionClaim),
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    avaxBalance: number;
    interestDue: number;
    interestDueWrapped?: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
    pendingPayoutWrapped?: number;
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                avaxBalance: 0,
                pendingPayoutWrapped: 0,
                interestDueWrapped: 0,
            });
        });
    }
    const addresses = getAddresses(networkID);

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);
    const wMemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);

    let interestDue, pendingPayout, bondMaturationBlock, interestDueWrapped, pendingPayoutWrapped;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout;

    if (bond.v2Bond) {
        interestDue /= Math.pow(10, 18);
    } else {
        interestDueWrapped = (await wMemoContract.MEMOTowMEMO(interestDue)) / Math.pow(10, 18);
        interestDue /= Math.pow(10, 9);
    }

    const lastTime = Number(bondDetails.lastTime);
    bondMaturationBlock = Number(bondDetails.vesting) + lastTime;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    if (networkID === Networks.AVAX) {
        pendingPayoutWrapped = (await wMemoContract.MEMOTowMEMO(pendingPayout)) / Math.pow(10, 18);
    }

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const pendingPayoutVal = bond.v2Bond ? ethers.utils.formatEther(pendingPayout) : ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        avaxBalance: Number(avaxVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
        interestDueWrapped,
        pendingPayoutWrapped,
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowanceLp: number;
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
                allowanceLp: 0,
            });
        });
    }

    if (token.isAvax) {
        const avaxBalance = await provider.getSigner().getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isAvax: true,
        };
    }

    const addresses = getAddresses(networkID);

    const tokenContract = new ethers.Contract(token.address, MimTokenContract, provider);

    let allowance,
        balance = "0",
        allowanceLp;

    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    allowanceLp = await tokenContract.allowance(address, addresses.ZAPIN_LP_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        allowanceLp: Number(allowanceLp),
    };
});

interface ICalcUserRewardsDetail {
    address: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserRewardsDetail {
    balance: number;
    token: IToken;
}

export interface ITokenReward {
    token: IToken;
    yieldWeek: number;
    earnedUsd: number;
}

async function userReward(tokenAddress: string, amount: string, provider: StaticJsonRpcProvider | JsonRpcProvider): Promise<IUserRewardsDetail> {
    let token = farmTokens.find(_token => _token.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase());

    if (!token) {
        const tokenContract = new ethers.Contract(tokenAddress, StableReserveContract, provider);
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        token = {
            name: symbol,
            decimals,
            address: tokenAddress,
            img: "",
        };
    }

    return {
        balance: Number(amount) / Math.pow(10, token.decimals),
        token: JSON.parse(JSON.stringify(token)),
    };
}

async function tokenReward(tokenAddress: string, provider: StaticJsonRpcProvider | JsonRpcProvider, farmContract: ethers.Contract, wmemoValue: BigNumber) {
    let token = farmTokens.find(_token => _token.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase());

    if (!token) {
        const tokenContract = new ethers.Contract(tokenAddress, StableReserveContract, provider);
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        token = {
            name: symbol,
            decimals,
            address: tokenAddress,
            img: "",
        };
    }

    // const rpt = await rewardPerToken(tokenAddress, farmContract);
    // const test = await earned(tokenAddress, wmemoValue, rpt, farmContract);
    const totalSupply = await farmContract.totalSupply();
    const { rewardRate } = await farmContract.rewardData(tokenAddress);

    const twm = totalSupply.add(wmemoValue);
    const earned = wmemoValue.mul(rewardRate).mul("86400").div(twm);
    const earnedUsd = Number(ethers.utils.formatEther(earned)) * getTokenPrice(token.name);

    const yieldPerDay = earnedUsd / 10;
    const yieldWeek = yieldPerDay * 365;

    return {
        yieldWeek: yieldWeek,
        token: JSON.parse(JSON.stringify(token)),
        earnedUsd,
    };
}

export const calculateUserRewardDetails = createAsyncThunk("account/calculateUserRewardsDetail", async ({ address, networkID, provider }: ICalcUserRewardsDetail) => {
    const addresses = getAddresses(networkID);
    const farmContract = new ethers.Contract(addresses.FARM_ADDRESS, FarmContract, provider);
    const wmemoPrice = (await getWmemoMarketPrice()) * Math.pow(10, 18);
    const wmemoValue = BigNumber.from("1000000000000000000000").mul("1000000000000000000").div(trim(wmemoPrice));
    const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    const wmemoStaked = await wmemoContract.balanceOf(addresses.FARM_ADDRESS);

    const tokenAddresses: string[] = [];

    const rewardTokenLength = await farmContract.rewardTokenLength();

    for (let i = 0; i < rewardTokenLength; i++) {
        const address = await farmContract.rewardTokens(i);
        if (!EXCLUDED_TOKEN.includes(address.toLocaleLowerCase())) {
            tokenAddresses.push(address);
        }
    }

    const tokenRewards = await Promise.all(tokenAddresses.map(address => tokenReward(address, provider, farmContract, wmemoValue)));
    const totalYield = tokenRewards.map(({ earnedUsd }) => earnedUsd).reduce((a, b) => a + b, 0);
    const apr = (totalYield / 10) * 365;

    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                rewards: [],
                tokenRewards,
                farmApr: apr,
                wmemoTotalFarmStaked: ethers.utils.formatEther(wmemoStaked),
            });
        });
    }

    const rawRewards = await Promise.all(tokenAddresses.map(async token => [token, await farmContract.earned(address, token)]));
    const rewards = await Promise.all(rawRewards.map((reward: string[]) => userReward(reward[0], reward[1], provider)));

    return {
        rewards,
        tokenRewards,
        farmApr: apr,
        wmemoTotalFarmStaked: ethers.utils.formatEther(wmemoStaked),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        memo: string;
        time: string;
        wmemo: string;
    };
    loading: boolean;
    staking: {
        time: number;
        memo: number;
        wmemo: number;
    };
    wrapping: {
        memo: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
    bridge: {
        wmemo: number;
    };
    farm: {
        wmemo: string;
    };
    rewards: IUserRewardsDetail[];
    tokenRewards: ITokenReward[];
    farmApr: number;
    wmemoTotalFarmStaked: string;
    redemption: {
        wmemo: number;
    };
    redemptionClaim: {
        avalable: string;
    };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { memo: "", time: "", wmemo: "" },
    staking: { time: 0, memo: 0, wmemo: 0 },
    wrapping: { memo: 0 },
    tokens: {},
    bridge: { wmemo: 0 },
    farm: { wmemo: "" },
    rewards: [],
    tokenRewards: [],
    farmApr: 0,
    redemption: { wmemo: 0 },
    redemptionClaim: { avalable: "" },
    wmemoTotalFarmStaked: "",
};

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
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getStaking.pending, state => {
                state.loading = true;
            })
            .addCase(getStaking.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getStaking.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserRewardDetails.pending, state => {
                state.loading = true;
            })
            .addCase(calculateUserRewardDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(calculateUserRewardDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
