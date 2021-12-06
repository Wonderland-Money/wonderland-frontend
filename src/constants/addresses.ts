import { Networks } from "./blockchain";

const RINKEBY = {
    DAO_ADDRESS: "0x7136da0f074bb665c0fAE0DdFc871DC8cC2EF7A6", // Address of a previously created DAO
    CUP_ADDRESS: "0xa7500DC446CE664b9c7996F6e67f37a29106a59f",
    TREASURY_ADDRESS: "0xd94faf4781E74da94f01d6428A563452Efef4007",
    CUP_BONDING_CALC_ADDRESS: "0xbF79b893533b31875442D92946a3EBd6D132b2f9",
    DISTRIBUTOR_ADDRESS: "0x8A98666E76613f61D776b58bfeD616b2dDE6E325",
    sCUP_ADDRESS: "0x821479F506c591510090EA45a6D223bc3d826eC4",
    STAKING_ADDRESS: "0x8E5b6bBAaEE41656D5AA051886a91696d6DBc34D",
    STAKING_HELPER_ADDRESS: "0x77780eB155B6B653505F587ffb4aA05f772Ec270",
    STAKING_WARMUP_ADDRESS: "0x2c0219dC202f5A26b6506F95759a3722220b9a46",
    DAI_ADDRESS: "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.FTM) return RINKEBY;

    throw Error("Network don't support");
};
