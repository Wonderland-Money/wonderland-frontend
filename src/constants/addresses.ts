import { Networks } from "./blockchain";

const ONE_MAINNET = {
    SPSI_ADDRESS: "0xbC464D465A8788b51671FaC8cF300E27407e20e4",
    PSI_ADDRESS: "0xe58E6E6Efb5B0f8A9B9DE571cf9B31D04F5dde73",
    STAKING_ADDRESS: "0x4F84933a98BdC0636B49d8e6C2e7619Ac9559D5D",
    STAKING_HELPER_ADDRESS: "0xdCf45115B8eA146CEF6C38032AD29534eb69e201",
    PSI_BONDING_CALC_ADDRESS: "0x00Bda6e44D8ca79Bc1F9a6EbBC43A919dd643145", // todo - need this
    TREASURY_ADDRESS: "0x2F46077254aAd2681ba128606000D850F1a8Dc94",
    FRAX_ADDRESS: "0xdA0113d74D8d3fc8401090f385cD98aa3E027505",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ONE) return ONE_MAINNET;

    throw Error("Network don't support");
};
