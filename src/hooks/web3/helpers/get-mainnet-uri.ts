import { Networks, NetworksInfo } from "../../../constants/blockchain";

export const getMainnetURI = (chain: Networks): string => {
    const rpc = NetworksInfo[chain].rpcUrls[0];
    if (!rpc) {
        throw Error("Chain don't support");
    }
    return rpc;
};
