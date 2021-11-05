import AvaxIcon from "../assets/tokens/AVAX.svg";
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
import MimIcon from "../assets/tokens/MIM.svg";
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

const aave: IToken = {
    name: "AAVE.e",
    address: "0x63a72806098Bd3D9520cC43356dD78afe5D386D9",
    img: AaveIcon,
    decimals: 18,
};

const apeX: IToken = {
    name: "APE-X",
    address: "0xd039C9079ca7F2a87D632A9C0d7cEa0137bAcFB5",
    img: ApeXIcon,
    decimals: 9,
};

const apein: IToken = {
    name: "APEIN",
    address: "0x938FE3788222A74924E062120E7BFac829c719Fb",
    img: ApeinIcon,
    decimals: 18,
};

const bifi: IToken = {
    name: "BIFI",
    address: "0xd6070ae98b8069de6B494332d1A1a81B6179D960",
    img: BifiIcon,
    decimals: 18,
};

const blizz: IToken = {
    name: "BLIZZ",
    address: "0xB147656604217a03Fe2c73c4838770DF8d9D21B8",
    img: BlizzIcon,
    decimals: 18,
};

const bnb: IToken = {
    name: "BNB",
    address: "0x264c1383EA520f73dd837F915ef3a732e204a493",
    img: BnbIcon,
    decimals: 18,
};

const boofi: IToken = {
    name: "BOOFI",
    address: "0xB00F1ad977a949a3CCc389Ca1D1282A2946963b0",
    img: BoofiIcon,
    decimals: 18,
};

const chart: IToken = {
    name: "CHART",
    address: "0xD769bDFc0CaEe933dc0a047C7dBad2Ec42CFb3E2",
    img: ChartIcon,
    decimals: 18,
};

const dai: IToken = {
    name: "DAI.e",
    address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    img: DaiEIcon,
    decimals: 18,
};

const dregg: IToken = {
    name: "DREGG",
    address: "0x88c090496125b751B4E3ce4d3FDB8E47DD079c57",
    img: DreggIcon,
    decimals: 18,
};

const ele: IToken = {
    name: "ELE",
    address: "0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0",
    img: EleIcon,
    decimals: 18,
};

const elk: IToken = {
    name: "ELK",
    address: "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C",
    img: ElkIcon,
    decimals: 18,
};

const frax: IToken = {
    name: "FRAX",
    address: "0xDC42728B0eA910349ed3c6e1c9Dc06b5FB591f98",
    img: FraxIcon,
    decimals: 18,
};

const gb: IToken = {
    name: "GB",
    address: "0x90842eb834cFD2A1DB0b1512B254a18E4D396215",
    img: GbIcon,
    decimals: 9,
};

const hat: IToken = {
    name: "HAT",
    address: "0x82FE038Ea4b50f9C957da326C412ebd73462077C",
    img: HatIcon,
    decimals: 18,
};

const husky: IToken = {
    name: "HUSKY",
    address: "0x65378b697853568dA9ff8EaB60C13E1Ee9f4a654",
    img: HuskyIcon,
    decimals: 18,
};

const ice: IToken = {
    name: "ICE",
    address: "0xe0Ce60AF0850bF54072635e66E79Df17082A1109",
    img: IceIcon,
    decimals: 18,
};

const joe: IToken = {
    name: "JOE",
    address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    img: JoeIcon,
    decimals: 18,
};

const klo: IToken = {
    name: "KLO",
    address: "0xb27c8941a7Df8958A1778c0259f76D1F8B711C35",
    img: KloIcon,
    decimals: 18,
};

const link: IToken = {
    name: "LINK.e",
    address: "0x5947BB275c521040051D82396192181b413227A3",
    img: LinkEIcon,
    decimals: 18,
};

const mai: IToken = {
    name: "MAI",
    address: "0x3B55E45fD6bd7d4724F5c47E0d1bCaEdd059263e",
    img: MainIcon,
    decimals: 18,
};

export const mim: IToken = {
    name: "MIM",
    address: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    img: MimIcon,
    decimals: 18,
};

const myak: IToken = {
    name: "mYAK",
    address: "0xdDAaAD7366B455AfF8E7c82940C43CEB5829B604",
    img: MYakIcon,
    decimals: 12,
};

const olive: IToken = {
    name: "OLIVE",
    address: "0x617724974218A18769020A70162165A539c07E8a",
    img: OliveIcon,
    decimals: 18,
};

const pefi: IToken = {
    name: "PEFI",
    address: "0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c",
    img: PefiIcon,
    decimals: 18,
};

const png: IToken = {
    name: "PNG",
    address: "0x60781C2586D68229fde47564546784ab3fACA982",
    img: PngIcon,
    decimals: 18,
};

const qi: IToken = {
    name: "QI",
    address: "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5",
    img: QiIcon,
    decimals: 18,
};

const relay: IToken = {
    name: "RELAY",
    address: "0x78c42324016cd91D1827924711563fb66E33A83A",
    img: RelayIcon,
    decimals: 18,
};

const sherpa: IToken = {
    name: "SHERPA",
    address: "0xa5E59761eBD4436fa4d20E1A27cBa29FB2471Fc6",
    img: SherpaIcon,
    decimals: 18,
};

const shibx: IToken = {
    name: "SHIBX",
    address: "0x440aBbf18c54b2782A4917b80a1746d3A2c2Cce1",
    img: ShibxIcon,
    decimals: 18,
};

const sing: IToken = {
    name: "SING",
    address: "0xF9A075C9647e91410bF6C402bDF166e1540f67F0",
    img: SingIcon,
    decimals: 18,
};

const snob: IToken = {
    name: "SNOB",
    address: "0xC38f41A296A4493Ff429F1238e030924A1542e50",
    img: SnobIcon,
    decimals: 18,
};

const spell: IToken = {
    name: "SPELL",
    address: "0xCE1bFFBD5374Dac86a2893119683F4911a2F7814",
    img: SpellIcon,
    decimals: 18,
};

const sushi: IToken = {
    name: "SUSHI.e",
    address: "0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76",
    img: SushiEIcon,
    decimals: 18,
};

const syn: IToken = {
    name: "SYN",
    address: "0x1f1E7c893855525b303f99bDF5c3c05Be09ca251",
    img: SynIcon,
    decimals: 18,
};

const teddy: IToken = {
    name: "TEBBY",
    address: "0x094bd7B2D99711A1486FB94d4395801C6d0fdDcC",
    img: TeddyIcon,
    decimals: 18,
};

const time: IToken = {
    name: "TIME",
    address: "0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
    img: TimeIcon,
    decimals: 9,
};

const tsd: IToken = {
    name: "TSD",
    address: "0x4fbf0429599460D327BD5F55625E30E4fC066095",
    img: TsdIcon,
    decimals: 18,
};

const usdc: IToken = {
    name: "USDC.e",
    address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
    img: UsdcEIcon,
    decimals: 6,
};

const usdt: IToken = {
    name: "USDT.e",
    address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    img: UsdtEIcon,
    decimals: 6,
};

const vso: IToken = {
    name: "VSO",
    address: "0x846D50248BAf8b7ceAA9d9B53BFd12d7D7FBB25a",
    img: VsoIcon,
    decimals: 18,
};

export const wavax: IToken = {
    name: "WAVAX",
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    img: WavaxIcon,
    decimals: 18,
};

const wbtc: IToken = {
    name: "WBTC.e",
    address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
    img: WBtcIcon,
    decimals: 8,
};

const wet: IToken = {
    name: "WET",
    address: "0xB1466d4cf0DCfC0bCdDcf3500F473cdACb88b56D",
    img: WetIcon,
    decimals: 18,
};

const weth: IToken = {
    name: "WETH.e",
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    img: WethEIcon,
    decimals: 18,
};

const xava: IToken = {
    name: "XAVA",
    address: "0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4",
    img: XavaIcon,
    decimals: 18,
};

const yak: IToken = {
    name: "YAK",
    address: "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7",
    img: YakIcon,
    decimals: 18,
};

export default [
    avax,
    aave,
    apeX,
    apein,
    bifi,
    blizz,
    bnb,
    boofi,
    chart,
    dai,
    dregg,
    ele,
    elk,
    frax,
    gb,
    hat,
    husky,
    ice,
    joe,
    klo,
    link,
    mai,
    mim,
    myak,
    olive,
    pefi,
    png,
    qi,
    relay,
    sherpa,
    shibx,
    sing,
    snob,
    spell,
    sushi,
    syn,
    teddy,
    time,
    tsd,
    usdc,
    usdt,
    vso,
    wavax,
    wbtc,
    wet,
    weth,
    xava,
    yak,
];
