import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingContract, sAmpTokenContract, AmpTokenContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import allBonds from "../../helpers/bond";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        console.log("Start of app-slice");
        const daiPrice = getTokenPrice("DAI");
        const addresses = getAddresses(networkID);

        const ohmPrice = getTokenPrice("AMP");
        const ohmAmount = 1512.12854088 * ohmPrice;

        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const sAmpContract = new ethers.Contract(addresses.sAMP_ADDRESS, sAmpTokenContract, provider);
        const ampContract = new ethers.Contract(addresses.AMP_ADDRESS, AmpTokenContract, provider);

        const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * daiPrice; // Problematic part

        const totalSupply = (await ampContract.totalSupply()) / Math.pow(10, 9);
        const circSupply = (await sAmpContract.circulatingSupply()) / Math.pow(10, 9);
        console.log("Total Supply: " + totalSupply);
        console.log("Circulating Supply: " + circSupply);

        const stakingTVL = circSupply * marketPrice;
        const marketCap = totalSupply * marketPrice;

        const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
        console.log("hey before");
        const tokenBalances = await Promise.all(tokenBalPromises);
        console.log("hey");
        const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, ohmAmount);

        const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
        const tokenAmounts = await Promise.all(tokenAmountsPromises);
        const rfvTreasury = tokenAmounts.reduce((tokenAmount0, tokenAmount1) => tokenAmount0 + tokenAmount1, ohmAmount);

        const timeBondsAmountsPromises = allBonds.map(bond => bond.getTimeAmount(networkID, provider));
        const timeBondsAmounts = await Promise.all(timeBondsAmountsPromises);
        const timeAmount = timeBondsAmounts.reduce((timeAmount0, timeAmount1) => timeAmount0 + timeAmount1, 0);
        const timeSupply = totalSupply - timeAmount;

        const rfv = rfvTreasury / timeSupply;

        const epoch = await stakingContract.epoch();
        console.log("Epoch: ");
        console.log(epoch);
        const stakingReward = epoch.distribute;
        console.log("1");
        const circ = await sAmpContract.circulatingSupply();
        console.log("2");
        const stakingRebase = stakingReward / circ;
        console.log("3");
        const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        console.log("4");
        const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
        console.log("5");

        const currentIndex = await stakingContract.index();
        console.log("6");
        const nextRebase = epoch.endTime;

        console.log("rfvTreasury: " + rfvTreasury);
        console.log("circSupply: " + circSupply);
        const treasuryRunway = rfvTreasury / circSupply;
        const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")) / 4.5,
            totalSupply,
            marketCap,
            currentBlock,
            circSupply,
            fiveDayRate,
            treasuryBalance,
            stakingAPY,
            stakingTVL,
            stakingRebase,
            marketPrice,
            currentBlockTime,
            nextRebase,
            rfv,
            runway,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    stakingTVL: number;
    marketPrice: number;
    marketCap: number;
    circSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    stakingAPY: number;
    stakingRebase: number;
    networkID: number;
    nextRebase: number;
    totalSupply: number;
    rfv: number;
    runway: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
