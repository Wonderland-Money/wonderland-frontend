import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,olympus,magic-internet-money&vs_currencies=usd";
    const { data } = await axios.get(url);

    cache["AVAX"] = data["avalanche-2"].usd;
    cache["MIM"] = data["magic-internet-money"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};

export const getWMemoPrice = async (address: string): Promise<number> => {
    // uses their public API key and passes in the connected wallet address to search for wMEMO.
    // otherwise return 0
    const url = `https://api.zapper.fi/v1/protocols/wonderland/balances?addresses[]=${address}&network=avalanche&api_key=5d1237c2-3840-4733-8e92-c5a58fe81b88&newBalances=true`;
    const { data } = await axios.get(url);
    const key = Object.keys(data)[0];

    // no wMEMO or MEMO found, avoid errors.
    if (data[key].products.length == 0) {
        return 0;
    }

    // this may actually be MEMO not wMEMO... but the value will only
    // get used and displayed if the wallet has a wMEMO balance...
    // so we can assume it is wMEMO?!
    const price = data[key].products[0].assets[0].tokens[0].price;

    return price > 0 ? price : 0;
};
