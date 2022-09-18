import { IZapperData, IZapperDataBalanceProductAssetToken } from "../hooks/useZapper";
import { getNetworkImg } from "./get-network-img";
import { ZAPPER_TOKENS_IMAGE, ZAPPER_PROTOCOL_IMAGE } from "../constants/endpoints";
import { ChainInfo, IData } from "../hooks/types";

export const HIDE_TOKENS: string[] = [
    "0xb54f16fb19478766a268f172c9480f8da1a7c9c3", // time avax
    "0x0da67235dd5787d67955420c84ca1cecd4e5bb3b", // wmemo avax
    "0x136acd46c134e8269052c62a67042d6bdedde3c9", // memo avax
    "0xddc0385169797937066bbd8ef409b5b3c0dfeb52", // wmemo ftm
    "0x63682bdc5f875e9bf69e201550658492c9763f89", // bsgg avax
    "0x5a33869045db8a6a16c9f351293501cfd92cf7ed", // bsgg ftm
    // "0x23320d8f931a52232f1dd9217b25721194cf6812", // bsgg/mim ftm
    // "0xb599e3cc5e7730865e74d78f2b9b67fdc627b743", // bsgg/mim avax
    // "0x67c0bba39a58df19887cd8d567388e54dc3e9a17", // bsgg/eth eth
    "0x69570f3e84f51ea70b7b68055c8d667e77735a25", // bsgg eth
];

export function sort(data: IData[], key: string) {
    return data.sort((a, b) => {
        //@ts-ignore
        return a[key] > b[key] ? -1 : b[key] > a[key] ? 1 : 0;
    });
}

export enum AssetType {
    WALLET = "wallet",
    VAULT = "vault",
    LEVERAGED_POSITION = "leveraged-position",
    LIQUIDITY_POOL = "liquidity-pool",
    CLAIMABLE = "claimable",
    FARM = "farm",
}

function parseToken(token: IZapperDataBalanceProductAssetToken, chainList?: ChainInfo[], disablehideToken = false): IData {
    let { balance, balanceRaw, price, symbol, network, address, decimals, img, tokens, appId, metaType, type } = token;

    const data: IData = {
        name: symbol,
        images: [img || ZAPPER_TOKENS_IMAGE(network, address)],
        price,
        balanceUsd: balance * price,
        balance: Number(balanceRaw) / Math.pow(10, decimals),
        address,
        protocolUrl: appId && ZAPPER_PROTOCOL_IMAGE(appId),
        chainUrl: network && getNetworkImg(network, chainList),
        isToken: true,
        type: metaType,
        protocol: appId,
        chain: network,
    };

    if (type === "pool") {
        const names = tokens?.map(token => token.symbol);
        data.name = names?.join("-") || data.name;
        const images = tokens?.map(({ address, network, img }) => img || ZAPPER_TOKENS_IMAGE(network, address));
        data.images = images || data.images;
        data.isToken = false;
    }

    if (Array.isArray(tokens)) {
        const assets = tokens.map(token => parseToken(token));
        const hidenToken = assets.find(token => token.address && HIDE_TOKENS.includes(token.address));
        if (hidenToken && data.balanceUsd && !disablehideToken) {
            data.balanceUsd = data.balanceUsd / 2;
        }

        data.tokens = assets;
    }

    return data;
}

export const calcByType = (datas: IZapperData[], assetType: AssetType, chainList?: ChainInfo[], disablehideToken = false): IData[] => {
    const data: IData[] = [];

    for (const { balances, appId } of datas) {
        for (const address in balances) {
            const { products } = balances[address];
            for (const product of products) {
                const { assets } = product;
                for (const asset of assets) {
                    if (asset.type === assetType) {
                        const { tokens } = asset;
                        for (const token of tokens) {
                            if (!token.appId && appId !== "tokens") {
                                token.appId = appId;
                            }

                            const parsed = parseToken(token, chainList, disablehideToken);
                            if (parsed.address && HIDE_TOKENS.includes(parsed.address.toLocaleLowerCase()) && !disablehideToken) {
                                continue;
                            }

                            let index = data.findIndex(asset => asset.address === parsed.address);

                            if (index === -1) {
                                data.push({
                                    ...parsed,
                                    balance: 0,
                                    balanceUsd: 0,
                                });
                                index = data.findIndex(asset => asset.address === parsed.address);
                            }
                            //@ts-ignore
                            data[index].balance += parsed.balance;
                            //@ts-ignore
                            data[index].balanceUsd += parsed.balanceUsd;
                        }
                    }
                }
            }
        }
    }
    return sort(data, "balanceUsd");
};
