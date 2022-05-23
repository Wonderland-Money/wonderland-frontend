import { Networks } from "../constants/blockchain";

const networks: { [key: string]: any } = {
    "ONE": {
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: "0x63564C40",
                    chainName: "Harmony Mainnet",
                    rpcUrls: ["https://api.harmony.one"],
                    blockExplorerUrls: ["https://explorer.harmony.one"],
                    nativeCurrency: {
                        name: "ONE",
                        symbol: "ONE",
                        decimals: 18,
                    },
                },
            ],
        },
    "AVAX": {
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: "0xA86A",
                chainName: "Avalanche Mainnet",
                rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
                blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
                nativeCurrency: {
                    name: "AVAX",
                    symbol: "AVAX",
                    decimals: 18,
                },
            },
        ],
    }
}

const switchRequest = () => {
    return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        // params: [{ chainId: "0x63564C40" }], // Harmony
        params: [{ chainId: "0xA86A" }], // @TODO: Switch to Avax chain
    });
};

const addChainRequest = (network: any) => {
    // Harmony One Network
    // return window.ethereum.request({
    //     method: "wallet_addEthereumChain",
    //     params: [
    //         {
    //             chainId: "0x63564C40",
    //             chainName: "Harmony Mainnet",
    //             rpcUrls: ["https://api.harmony.one"],
    //             blockExplorerUrls: ["https://explorer.harmony.one"],
    //             nativeCurrency: {
    //                 name: "ONE",
    //                 symbol: "ONE",
    //                 decimals: 18,
    //             },
    //         },
    //     ],
    // });
    // Avalanche Network
    return window.ethereum.request(networks[network]);
};

export const switchNetwork = async () => {
    if (window.ethereum) {
        try {
            await switchRequest();
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest("AVAX");
                    await switchRequest();
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
