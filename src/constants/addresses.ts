import { Networks } from "./blockchain";

const FTM_MAINNET = {
    DAO_ADDRESS: "0x7136da0f074bb665c0fae0ddfc871dc8cc2ef7a6", //
    sAMP_ADDRESS: "0x15F2e5E351E0d07e8bC24cA91f175aA805e3487A", //
    AMP_ADDRESS: "0x390bcb7f3c58851daeb7336b8ac3d9bfb2b58c9a", //
    DAI_ADDRESS: "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735", //
    STAKING_ADDRESS: "0xc4560119dDF6E04bDf11583D297026a18d559Fb7", //
    STAKING_HELPER_ADDRESS: "0x80564d2742a143bb8160a8ab82c8253f40136255", //
    AMP_BONDING_CALC_ADDRESS: "0x23E025deD74ba5F533fA59E133165179944a11a8", //
    TREASURY_ADDRESS: "0x5a0ab58ad4fb907374abc69f47f546820d9eb9f1", //
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.FTM) return FTM_MAINNET;

    throw Error("Network don't support");
};
