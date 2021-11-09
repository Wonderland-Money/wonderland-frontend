import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=fantom,dai&vs_currencies=usd";
    const { data } = await axios.get(url);

    cache["FTM"] = data["fantom"].usd;
    cache["DAI"] = data["dai"].usd;
    cache["AMP"] = 1.0;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
