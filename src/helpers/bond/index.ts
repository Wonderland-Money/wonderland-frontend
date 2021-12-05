import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import AvaxIcon from "../../assets/tokens/AVAX.svg";
import MimTimeIcon from "../../assets/tokens/TIME-MIM.svg";
import AvaxTimeIcon from "../../assets/tokens/TIME-AVAX.svg";

import { StableBondContract, LpBondContract, WavaxBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xC5f44ceCa77262B129262b283fDA8D4bb256B300", // Done
            reserveAddress: "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735", // DAI on Rinkeby
        },
    },
});
/*

export const wavax = new CustomBond({
    name: "wavax",
    displayName: "wFTM",
    bondToken: "FTM",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xE02B1AA2c4BE73093BE79d763fdFFC0E3cf67318",
            reserveAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        },
    },
});

*/
export const daiCup = new LPBond({
    name: "dai_amp_lp",
    displayName: "CUP-DAI LP",
    bondToken: "DAI",
    bondIconSvg: MimTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xfB8e42E6E9E6f275ebe9DFd15e8D3878aC4C03c2", // Done
            reserveAddress: "0xDDFcB3e750879ba95791206afAbC04681422763c", // Done
        },
    },
    lpUrl: "https://app.sushi.com/swap?inputCurrency=0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735&outputCurrency=0x390BcB7F3C58851DaeB7336B8Ac3d9BFB2b58c9a",
});
/*
export const avaxTime = new CustomLPBond({
    name: "avax_time_lp",
    displayName: "CUP-FTM LP",
    bondToken: "FTM",
    bondIconSvg: AvaxTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xc26850686ce755FFb8690EA156E5A6cf03DcBDE1",
            reserveAddress: "0xf64e1c5B6E17031f5504481Ac8145F4c3eab4917",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/FTM/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});
 */

export default [dai, daiCup];
