import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=magic-internet-money,frax&vs_currencies=usd";
    const { data } = await axios.get(url);

    cache["MIM"] = data["magic-internet-money"].usd;
    cache["FRAX"] = data["frax"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
