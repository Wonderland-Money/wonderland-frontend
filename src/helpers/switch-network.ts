import { Networks } from "../constants/blockchain";
import { getChainInfo } from "../helpers/get-chains";

const switchRequest = (chain: Networks) => {
    const info = getChainInfo(chain);
    return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: info.chainId }],
    });
};

const addChainRequest = (chain: Networks) => {
    const { chainId, chainName, rpcUrls, blockExplorerUrls, nativeCurrency } = getChainInfo(chain);

    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId,
                chainName,
                rpcUrls,
                blockExplorerUrls,
                nativeCurrency,
            },
        ],
    });
};

export const swithNetwork = async (chain = Networks.AVAX) => {
    if (window.ethereum) {
        try {
            await switchRequest(chain);
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest(chain);
                    await switchRequest(chain);
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
