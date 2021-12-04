import { Networks } from "../../constants/blockchain";
import { LPBond } from "./lp-bond";
import { StableBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import UstIcon from "../../assets/tokens/UST.svg";
import FraxIcon from "../../assets/tokens/FRAX.svg";

import { StableBondContract, LpBondContract, StableReserveContract, LpReserveContract } from "../../abi";

// TODO - not needed
export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.ONE]: {
            bondAddress: "0x694738E0A438d90487b4a549b201142c1a97B556",
            reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
        },
    },
});

export const ust = new StableBond({
    name: "ust",
    displayName: "UST",
    bondToken: "UST",
    bondIconSvg: UstIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.ONE]: {
            bondAddress: "0x694738E0A438d90487b4a549b201142c1a97B556", // TODO - need this
            reserveAddress: "0x224e64ec1bdce3870a6a6c777edd450454068fec", // TODO - need this
        },
    },
});

export const frax = new StableBond({
    name: "frax",
    displayName: "FRAX",
    bondToken: "FRAX",
    bondIconSvg: FraxIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.ONE]: {
            bondAddress: "0x312418e484CE93851a5712A5CDd6bEe303080A67",
            reserveAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7", // TODO - need this
        },
    },
});

// todo - rename
export const mimPsi = new LPBond({
    name: "mim_psi_lp",
    displayName: "PSI-MIM LP",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.ONE]: {
            bondAddress: "0x19513619465B1331A3e4750a99310182426E9071",
            reserveAddress: "0x113f413371fc4cc4c9d6416cf1de9dfd7bf747df", // TODO - change
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});

export default [ust, frax];
