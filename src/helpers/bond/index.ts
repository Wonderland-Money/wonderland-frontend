import { Networks } from "../../constants";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";
import { getAddresses } from "../../constants";

import MimIcon from "../../assets/tokens/mim.svg";
import AvaxIcon from "../../assets/tokens/avax.svg";
import MimTimeIcon from "../../assets/tokens/blocks-mim.png";
import AvaxTimeIcon from "../../assets/tokens/blocks-avax.png";

import { StableBondContract, LpBondContract, WavaxBondContract, StableReserveContract, LpReserveContract } from "../../abi";

const avaAddresses = getAddresses(Networks.AVAX);

export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,  // AnyswapV5ERC20
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: avaAddresses.MIM_BLOCK_BOND_ADDRESS,
            reserveAddress: avaAddresses.MIM_BLOCK_REVERSE_ADDRESS
        },
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const wavax = new CustomBond({
    name: "wavax",
    displayName: "wAVAX",
    bondToken: "AVAX",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: avaAddresses.wAVAX_BLOCK_BOND_ADDRESS,
            reserveAddress: avaAddresses.wAVAX_BLOCK_REVERSE_ADDRESS,    // EACAggregatorProxy
        },
    },
    tokensInStrategy: "756916000000000000000000",
});

export const mimBlock = new LPBond({
    name: "mim_block_lp",
    displayName: "BLOCK-MIM LP",
    bondToken: "MIM",
    bondIconSvg: MimTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: avaAddresses.MIM_BLOCK_LP_BOND_ADDRESS,
            reserveAddress: avaAddresses.MIM_BLOCK_LP_REVERSE_ADDRESS, // JoePair
        },
    },
    lpUrl: `https://www.traderjoexyz.com/#/pool/${avaAddresses.MIM_ADDRESS}/${avaAddresses.BLOCK_ADDRESS}`,
});

export const avaxBlock = new CustomLPBond({
    name: "avax_block_lp",
    displayName: "BLOCK-AVAX LP",
    bondToken: "AVAX",
    bondIconSvg: AvaxTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: avaAddresses.AVAX_BLOCK_LP_BOND_ADDRESS,
            reserveAddress: avaAddresses.AVAX_BLOCK_LP_REVERSE_ADDRESS, // joepair 2
        },
    },
    lpUrl: `https://www.traderjoexyz.com/#/pool/AVAX/${avaAddresses.BLOCK_ADDRESS}`,
});

export default [mim, wavax, mimBlock, avaxBlock];

