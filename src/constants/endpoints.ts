export const ZAPPER_BALANCES_URL =
    "https://api.zapper.fi/v1/balances?addresses[0]=0x1c46450211cb2646cc1da3c5242422967ed9e04c&addresses[1]=0x355d72fb52ad4591b2066e43e89a7a38cf5cb341&addresses[2]=0x78a9e536ebda08b5b9edbe5785c9d1d50fa3278c&addresses[3]=0xb6b80f4ea8fb4117928d3c819e8ac6f1a3837baf&nonNilOnly=true&networks[0]=ethereum&networks[5]=fantom&networks[6]=avalanche&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241";
export const ZAPPER_TOKENS_IMAGE = (network: string, address: string) => `https://storage.googleapis.com/zapper-fi-assets/tokens/${network}/${address}.png`;
export const ZAPPER_PROTOCOL_IMAGE = (protocol: string) => `https://storage.googleapis.com/zapper-fi-assets/apps/${protocol}.png`;
export const MEDIUM_RSS = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-defi-wonderland";

export const DEBANK_CHAIN_LIST = "https://openapi.debank.com/v1/chain/list";

export const WONDERLAND_TREASURY_BALANCE = "https://analytics.abracadabra.money/api/wonderland/treasury/balance";
export const WONDERLAND_API = "https://analytics.abracadabra.money/api/wonderland";
