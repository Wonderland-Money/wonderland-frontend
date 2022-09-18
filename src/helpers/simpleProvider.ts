import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "src/constants";
import { getMainnetURI } from "src/hooks/web3/helpers";

export const simpleProvider = (network: Networks) => {
    const url = getMainnetURI(network);
    return new StaticJsonRpcProvider(url);
};
