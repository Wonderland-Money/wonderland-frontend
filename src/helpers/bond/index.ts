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
            bondAddress: "0x017b01b210F2Cb3B8b3c5F3A1b1FF2E7cf9177A3",
            reserveAddress: "0xFa7191D292d5633f702B0bd7E3E3BcCC0e633200", // TODO - change to real FRAX after testing
        },
    },
});

// todo - rename
export const fraxPsi = new LPBond({
    name: "frax_psi_lp",
    displayName: "PSI-FRAX LP",
    bondToken: "FRAX",
    bondIconSvg: FraxIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.ONE]: {
            bondAddress: "0x3BA4Ea56ac264a9c80850a5A5442DBaA440D3722",
            reserveAddress: "0x8Ee113Eb4F0e9596A8e2a6Acd4095eeED1E0B9b6", // TODO - change
        },
    },
    lpUrl: "https://app.sushi.com/add/0x23eDB53026F17906cD7Fd9f4192fbD42bf61aC6d/0xFa7191D292d5633f702B0bd7E3E3BcCC0e633200",
});

export default [frax, fraxPsi];
