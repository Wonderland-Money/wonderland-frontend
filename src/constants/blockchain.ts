import AvaxIcon from "../assets/networks/avalanche-icon.png";
import FtmIcon from "../assets/networks/fantom-icon.svg";
import EthIcon from "../assets/networks/ethereum-icon.svg";
import AethIcon from "../assets/networks/arbitrum-icon.svg";

export const TOKEN_DECIMALS = 9;

export enum Networks {
    AVAX = 43114,
    FANTOM = 250,
    ETH = 1,
    AETH = 42161,
}

export const DEFAULD_NETWORK = Networks.AVAX;

export const AVAILABLE_CHAINS = [Networks.AVAX, Networks.FANTOM, Networks.ETH, Networks.AETH];
export const WMEMO_BRIDG_CHAINS = [Networks.AVAX, Networks.FANTOM, Networks.ETH, Networks.AETH];

export const NetworksInfo = {
    [Networks.AVAX]: {
        chainId: "0xa86a",
        chainName: "Avalanche",
        shortName: "AVAX",
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
        },
        img: AvaxIcon,
    },
    [Networks.FANTOM]: {
        chainId: "0xfa",
        chainName: "Fantom",
        shortName: "FTM",
        rpcUrls: ["https://rpc.ftm.tools/", "https://rpcapi.fantom.network/", "https://rpc.fantom.network/"],
        blockExplorerUrls: ["https://ftmscan.com/"],
        nativeCurrency: {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18,
        },
        img: FtmIcon,
    },
    [Networks.ETH]: {
        chainId: "0x1",
        chainName: "Ethereum",
        shortName: "ETH",
        rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        blockExplorerUrls: ["https://etherscan.io"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
        },
        img: EthIcon,
    },
    [Networks.AETH]: {
        chainId: "0xa4b1",
        chainName: "Arbitrum",
        shortName: "AETH",
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
        nativeCurrency: {
            name: "Ether",
            symbol: "AETH",
            decimals: 18,
        },
        img: AethIcon,
    },
};
