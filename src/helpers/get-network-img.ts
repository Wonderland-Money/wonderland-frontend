import { ChainInfo } from "src/hooks/types";

export const getNetworkImg = (network: string, chainList?: ChainInfo[]) => {
    let url;

    if (chainList) {
        const chain = chainList.find(chain => chain.name.toLocaleLowerCase() === network);

        if (chain) {
            url = chain.logo_url;
        }
    }

    return url;
};
