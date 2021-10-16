import { ethers, constants, BigNumber } from "ethers";
import {
  isBondLP,
  getMarketPrice,
  contractForBond,
  contractForReserve,
  addressForAsset,
  bondName,
  getTokenPrice,
} from "../../helpers";
import { calculateUserBondDetails, getBalances } from "./account-slice";
import { getAddresses, BONDS } from "../../constants";
import { BondingCalcContract } from "../../abi";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { fetchAccountSuccess } from "./account-slice";

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IChangeApproval {
  bond: string;
  provider: JsonRpcProvider;
  networkID: number;
  address: string;
}

export interface IBond {
  [key: string]: any;
}

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ bond, provider, networkID, address }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = contractForReserve(bond, networkID, signer);
    const addresses = getAddresses(networkID);

    let approveTx;
    try {
      if (bond === BONDS.mim) {
        approveTx = await reserveContract.approve(addresses.BONDS.MIM, constants.MaxUint256);
      }
      if (bond === BONDS.mim_time) {
        approveTx = await reserveContract.approve(addresses.BONDS.MIM_TIME, constants.MaxUint256);
      }
      if (bond === BONDS.avax_time) {
        approveTx = await reserveContract.approve(addresses.BONDS.AVAX_TIME, constants.MaxUint256);
      }
      if (bond === BONDS.wavax) {
        approveTx = await reserveContract.approve(addresses.BONDS.WAVAX, constants.MaxUint256);
      }
      dispatch(
        fetchPendingTxns({ txnHash: approveTx.hash, text: "Approving " + bondName(bond), type: "approve_" + bond }),
      );
      await approveTx.wait();
    } catch (error: any) {
      alert(error.message);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

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

    return dispatch(
      fetchAccountSuccess({
        [bond]: {
          allowance: Number(allowance),
          balance: Number(balance),
        },
      }),
    );
  },
);

interface ICalcBondDetails {
  bond: string;
  value?: string | null;
  provider: JsonRpcProvider;
  networkID: number;
}

export const calcBondDetails = createAsyncThunk(
  "bonding/calcBondDetails",
  async ({ bond, value, provider, networkID }: ICalcBondDetails) => {
    let amountInWei;
    if (!value || value === "") {
      amountInWei = ethers.utils.parseEther("0.0001"); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(value);
    }

    let bondPrice, bondDiscount, valuation, bondQuote;

    const addresses = getAddresses(networkID);

    const bondContract = contractForBond(bond, networkID, provider);

    const bondCalcContract = new ethers.Contract(addresses.TIME_BONDING_CALC_ADDRESS, BondingCalcContract, provider);

    const terms = await bondContract.terms();

    const maxBondPrice = await bondContract.maxPayout();

    let debtRatio = (await bondContract.standardizedDebtRatio()) / Math.pow(10, 9);

    if (bond.includes("lp")) {
      debtRatio = debtRatio / Math.pow(10, 7);
    }

    let marketPrice = await getMarketPrice(networkID, provider);

    const mimPrice = getTokenPrice("MIM");
    marketPrice = (marketPrice / Math.pow(10, 9)) * mimPrice;

    try {
      bondPrice = await bondContract.bondPriceInUSD();

      if (bond === BONDS.avax_time) {
        const avaxPrice = getTokenPrice("AVAX");
        bondPrice = bondPrice * avaxPrice;
      }

      bondDiscount = (marketPrice * Math.pow(10, 18) - bondPrice) / bondPrice;
    } catch (e) {
      console.log("error getting bondPriceInUSD", e);
    }

    if (bond === BONDS.mim_time) {
      valuation = await bondCalcContract.valuation(addresses.RESERVES.MIM_TIME, amountInWei);
      bondQuote = await bondContract.payoutFor(valuation);
      bondQuote = bondQuote / Math.pow(10, 9);
    } else {
      if (bond === BONDS.avax_time) {
        valuation = await bondCalcContract.valuation(addresses.RESERVES.AVAX_TIME, amountInWei);
        bondQuote = await bondContract.payoutFor(valuation);
        bondQuote = bondQuote / Math.pow(10, 9);
      } else {
        bondQuote = await bondContract.payoutFor(amountInWei);
        bondQuote = bondQuote / Math.pow(10, 18);
      }
    }

    // Display error if user tries to exceed maximum.
    if (!!value && bondQuote > maxBondPrice / Math.pow(10, 9)) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (maxBondPrice / Math.pow(10, 9)).toFixed(2).toString() +
          " TIME.",
      );
    }

    // Calculate bonds purchased
    const token = contractForReserve(bond, networkID, provider);
    let purchased = await token.balanceOf(addresses.TREASURY_ADDRESS);

    if (isBondLP(bond)) {
      const markdown = await bondCalcContract.markdown(addressForAsset(bond, networkID));
      purchased = await bondCalcContract.valuation(addressForAsset(bond, networkID), purchased);
      purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));

      if (bond.indexOf("avax") >= 0) {
        const avaxPrice = getTokenPrice("AVAX");
        purchased = purchased * avaxPrice;
      }
    } else if (bond === BONDS.wavax) {
      purchased = purchased / Math.pow(10, 18);
      const avaxPrice = getTokenPrice("AVAX");
      purchased = purchased * avaxPrice;
    } else {
      purchased = purchased / Math.pow(10, 18);
    }

    return {
      bond,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm: Number(terms.vestingTerm),
      maxBondPrice: maxBondPrice / Math.pow(10, 9),
      bondPrice: bondPrice / Math.pow(10, 18),
      marketPrice,
    };
  },
);

interface IBondAsset {
  value: string;
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
  slippage: number;
  useAvax: boolean;
}
export const bondAsset = createAsyncThunk(
  "bonding/bondAsset",
  async ({ value, address, bond, networkID, provider, slippage, useAvax }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005;
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");

    const signer = provider.getSigner();
    const bondContract = contractForBond(bond, networkID, signer);

    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    let bondTx;
    try {
      if (useAvax) {
        bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress, { value: valueInWei });
      } else {
        bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      }
      dispatch(fetchPendingTxns({ txnHash: bondTx.hash, text: "Bonding " + bondName(bond), type: "bond_" + bond }));
      await bondTx.wait();
      dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      return;
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else if (error.code === -32603 && error.data && error.data.message.indexOf("Bond too small") >= 0) {
        alert("Bond too small");
      } else if (error.code === -32603 && error.data && error.data.message) {
        alert(error.data.message.split(":")[1].trim());
      } else alert(error.message);
      return;
    } finally {
      if (bondTx) {
        dispatch(clearPendingTxn(bondTx.hash));
      }
    }
  },
);

interface IRedeemBond {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
  autostake: boolean;
}

export const redeemBond = createAsyncThunk(
  "bonding/redeemBond",
  async ({ address, bond, networkID, provider, autostake }: IRedeemBond, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const bondContract = contractForBond(bond, networkID, signer);

    let redeemTx;
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = "redeem_bond_" + bond + (autostake === true ? "_autostake" : "");
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: "Redeeming " + bondName(bond), type: pendingTxnType }));
      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      dispatch(getBalances({ address, networkID, provider }));
      return;
    } catch (error: any) {
      alert(error.message);
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
  },
);

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
        state[action.payload.bond] = action.payload;
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: { bonding: IBond }) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
