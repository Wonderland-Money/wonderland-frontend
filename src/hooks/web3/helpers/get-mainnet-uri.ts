import { Networks, checkValidNetwork } from "../../../constants/blockchain";

export const getMainnetURI = (network: Networks): string => {
    if (checkValidNetwork(network)) {
        switch (network) {
            case Networks.ONE:
                return "https://api.s0.t.hmny.io/";
            case Networks.AVAX:
                return "https://api.avax.network/ext/bc/C/rpc";
        }
    }
    return "https://api.s0.t.hmny.io/";
};
