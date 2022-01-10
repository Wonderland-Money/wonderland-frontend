import AvaxIcon from "../assets/tokens/avax.svg";
import AaveIcon from "../assets/tokens/AAVE.e.png";
import ApeXIcon from "../assets/tokens/Ape-X.png";
import ApeinIcon from "../assets/tokens/APEIN.png";
import BifiIcon from "../assets/tokens/BIFI.png";
import BlizzIcon from "../assets/tokens/BLIZZ.png";
import BnbIcon from "../assets/tokens/BNB.png";
import BoofiIcon from "../assets/tokens/BOOFI.png";
import ChartIcon from "../assets/tokens/CHART.png";
import DaiEIcon from "../assets/tokens/DAI.e.png";
import DreggIcon from "../assets/tokens/DREGG.png";
import EleIcon from "../assets/tokens/ELE.png";
import ElkIcon from "../assets/tokens/ELK.png";
import FraxIcon from "../assets/tokens/FRAX.png";
import GbIcon from "../assets/tokens/GB.png";
import HatIcon from "../assets/tokens/HAT.png";
import HuskyIcon from "../assets/tokens/HUSKY.png";
import IceIcon from "../assets/tokens/ICE.png";
import JoeIcon from "../assets/tokens/JOE.png";
import KloIcon from "../assets/tokens/KLO.png";
import LinkEIcon from "../assets/tokens/LINK.e.png";
import MainIcon from "../assets/tokens/MAI.png";
import MimIcon from "../assets/tokens/mim.svg";
import MYakIcon from "../assets/tokens/mYAK.png";
import OliveIcon from "../assets/tokens/OLIVE.png";
import PefiIcon from "../assets/tokens/PEFI.png";
import PngIcon from "../assets/tokens/PNG.png";
import QiIcon from "../assets/tokens/QI.png";
import RelayIcon from "../assets/tokens/RELAY.png";
import SherpaIcon from "../assets/tokens/SHERPA.png";
import ShibxIcon from "../assets/tokens/SHIBX.png";
import SingIcon from "../assets/tokens/SING.png";
import SnobIcon from "../assets/tokens/SNOB.png";
import SpellIcon from "../assets/tokens/SPELL.png";
import SushiEIcon from "../assets/tokens/SUSHI.e.png";
import SynIcon from "../assets/tokens/SYN.png";
import TeddyIcon from "../assets/tokens/TEDDY.png";
import TimeIcon from "../assets/tokens/TIME.svg";
import TsdIcon from "../assets/tokens/TSD.png";
import UsdcEIcon from "../assets/tokens/USDC.e.png";
import UsdtEIcon from "../assets/tokens/USDT.e.png";
import VsoIcon from "../assets/tokens/VSO.png";
import WavaxIcon from "../assets/tokens/WAVAX.png";
import WBtcIcon from "../assets/tokens/WBTC.e.png";
import WetIcon from "../assets/tokens/WET.png";
import WethEIcon from "../assets/tokens/WETH.e.png";
import XavaIcon from "../assets/tokens/XAVA.png";
import YakIcon from "../assets/tokens/YAK.png";

export interface IToken {
    name: string;
    address: string;
    img: string;
    isAvax?: boolean;
    decimals: number;
}

export const avax: IToken = {
    name: "AVAX",
    isAvax: true,
    img: AvaxIcon,
    address: "",
    decimals: 18,
};


export const mim: IToken = {
    name: "MIM",
    address: "0x2B699A8315930b7DD3731d43CcBEc64a62B4Fc8E",
    img: MimIcon,
    decimals: 18,
};

const time: IToken = {
    name: "TIME",
    address: "0x0cF22e3d8dB81CB9e606f3a7837c48c1B6fC9a27",
    img: TimeIcon,
    decimals: 9,
};

const block: IToken = {
    name: "BLOCK",
    address: "0x6fF83eb56d9Df4007eb3593757351F2FB0011F19",
    img: TimeIcon,
    decimals: 9,
};


export const wavax: IToken = {
    name: "WAVAX",
    address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    img: WavaxIcon,
    decimals: 18,
};


export default [
    avax,
    block,
    mim,
    time,
    wavax,
];
