import { Networks } from "./blockchain";

const ONE_MAINNET = {
    FRAX_ADDRESS: "0xFa7191D292d5633f702B0bd7E3E3BcCC0e633200", // the USD stablecoin used in stableBond and the baseToken/stableToken LP pair.
    PSI_ADDRESS: "0x23eDB53026F17906cD7Fd9f4192fbD42bf61aC6d",
    SPSI_ADDRESS: "0x4BE07F1dA7D67364458F8C0E937b067baF472B3C",
    STAKING_ADDRESS: "0xF1B81FE5290Abf53F690903837feb25671c415F5", // rebases every 8 hours
    STAKING_HELPER_ADDRESS: "0x7b222A1B02e8bE3223C56220117ef0DD33310BE1", // use this instead of the staking contract directly to avoid user having to do extra steps to get their stake_token
    TREASURY_ADDRESS: "0x6e0b3957b8c22c0ccd9d145d7188311ceda10670",
    PSI_BONDING_CALC_ADDRESS: "0x1e5A65bF2Bf283959665d04C13f37c71b7541081", // calculate the value of bonds when paying with LP
    presaleCore: "0xB20174263CD73683b1d19B84eA72EBAAa1ECB688", // presale contract using PresalePrestaked
    presaleContributor: "0x89E36931976E1372831E11416fF2008348D9602e", // presale contract using PresaleWhitelisted
    presalePhase1: "0xd97a5E7a862Bf2294108Fe26C4aA9de0104D2A3A", // presale contract using PresaleWhitelisted
    presalePhase2: "0xa83dad3cec582245D5C94FBF4e74AC32cb618b8a", // presale contract using PresaleOpen
    presalePhase3: "0x53ecfcBBa09Aa852C0F13A0501e208b59c75d257", // presale contract using PresaleOpen
    presalePhase4: "0xCe5A688530D725a9CE50371a7fcB1e9062Ba9221",
    krakenSlayers: "0xB21AEa83a92e7CF4544e1C0B7dF052C4796Db7D1",
    maintainers: "0xD72d6820dde80289B1e439C7968a95AAc48270DF", // maintainers are whitelisted here for their maintance subsidy
};

const AVAX_MAINNET = {
    FRAX_ADDRESS: "0xFa7191D292d5633f702B0bd7E3E3BcCC0e633200", // the USD stablecoin used in stableBond and the baseToken/stableToken LP pair.
    PSI_ADDRESS: "0x23eDB53026F17906cD7Fd9f4192fbD42bf61aC6d",
    SPSI_ADDRESS: "0x4BE07F1dA7D67364458F8C0E937b067baF472B3C",
    STAKING_ADDRESS: "0xF1B81FE5290Abf53F690903837feb25671c415F5", // rebases every 8 hours
    STAKING_HELPER_ADDRESS: "0x7b222A1B02e8bE3223C56220117ef0DD33310BE1", // use this instead of the staking contract directly to avoid user having to do extra steps to get their stake_token
    TREASURY_ADDRESS: "0x6e0b3957b8c22c0ccd9d145d7188311ceda10670",
    PSI_BONDING_CALC_ADDRESS: "0x1e5A65bF2Bf283959665d04C13f37c71b7541081", // calculate the value of bonds when paying with LP
    presaleCore: "0xB20174263CD73683b1d19B84eA72EBAAa1ECB688", // presale contract using PresalePrestaked
    presaleContributor: "0x89E36931976E1372831E11416fF2008348D9602e", // presale contract using PresaleWhitelisted
    presalePhase1: "0xd97a5E7a862Bf2294108Fe26C4aA9de0104D2A3A", // presale contract using PresaleWhitelisted
    presalePhase2: "0xa83dad3cec582245D5C94FBF4e74AC32cb618b8a", // presale contract using PresaleOpen
    presalePhase3: "0x53ecfcBBa09Aa852C0F13A0501e208b59c75d257", // presale contract using PresaleOpen
    presalePhase4: "0xCe5A688530D725a9CE50371a7fcB1e9062Ba9221",
    krakenSlayers: "0xB21AEa83a92e7CF4544e1C0B7dF052C4796Db7D1",
    maintainers: "0xD72d6820dde80289B1e439C7968a95AAc48270DF", // maintainers are whitelisted here for their maintance subsidy
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ONE) return ONE_MAINNET;
    if (networkID === Networks.AVAX) return AVAX_MAINNET;

    throw Error("Network don't support");
};
