import { ZAPPER_PROTOCOL_IMAGE } from "src/constants";
import { RawData, DataSource, IData, ChainInfo } from "../hooks/types";
import { getNetworkImg } from "./get-network-img";
import { HIDE_TOKENS, sort } from "./zapper";

function merge(array0: IData[], array1: IData[]): IData[] {
    const allData = [...array0, ...array1];
    let result: IData[] = [];

    for (const data of allData) {
        let index = result.findIndex(a => a.address?.toLocaleLowerCase() === data.address?.toLocaleLowerCase());
        if (index !== -1) {
            if (data.price > result[index].price) {
                result[index].price = data.price;
            }
            //@ts-ignore
            result[index].balance += data.balance;
            //@ts-ignore
            result[index].balanceUsd += data.balanceUsd;
        } else {
            index = result.findIndex(a => a.name?.toLocaleLowerCase() === data.name?.toLocaleLowerCase());

            if (index !== -1) {
                if (data.price > result[index].price) {
                    result[index].price = data.price;
                }
                //@ts-ignore
                result[index].balance += data.balance;
                //@ts-ignore
                result[index].balanceUsd += data.balanceUsd;
            } else {
                result.push(JSON.parse(JSON.stringify(data)));
            }
        }
    }

    result = result.map(data => {
        if (data.balance && data.price) {
            data.balanceUsd = data.balance * data.price;
        }

        return data;
    });

    return sort(result, "balanceUsd");
}

function clearForHideToken(datas: IData[]) {
    datas = JSON.parse(JSON.stringify(datas));
    const filtred = datas.filter(data => {
        if (data.isToken && HIDE_TOKENS.includes(data.address.toLowerCase())) return false;
        return true;
    });

    return filtred.map(data => {
        if (data.tokens && data.tokens.find(t => HIDE_TOKENS.includes(t.address.toLowerCase()))) {
            data.balanceUsd = data.balanceUsd / 2;
        }

        return data;
    });
}

export function mergeData(zapper: RawData, custom: RawData, chainList?: ChainInfo[]): DataSource {
    const wallet = merge(zapper.wallet, custom.wallet);

    let allData = [...wallet, ...zapper.vaults, ...zapper.leveragedPosition, ...zapper.liquidityPool, ...zapper.claimable, ...zapper.farm];
    allData = allData.map(asset => (asset.isToken ? asset : asset.tokens || [])).flat();
    allData = allData.filter(asset => !HIDE_TOKENS.includes(asset.address.toLowerCase()));

    const total = allData.map(({ balanceUsd }) => balanceUsd).reduce((a, b) => a + b, 0) - zapper.debt.map(({ balanceUsd }) => balanceUsd).reduce((a, b) => a + b, 0);

    const allNetworks = [...new Set(allData.map(({ chain }) => chain || "").filter(chain => Boolean(chain)))];
    const networks: IData[] = allNetworks.map(chain => {
        const image = getNetworkImg(chain, chainList);
        return { name: chain, images: image ? [image] : [], isToken: false, balanceUsd: 0, price: 0, address: "" };
    });
    for (const chain of allNetworks) {
        const chainData = allData.filter(data => data.chain === chain).map(({ balanceUsd }) => balanceUsd);
        const deptsData = zapper.debt.filter(data => data.chain === chain).map(({ balanceUsd }) => balanceUsd);
        const chainValue = chainData.reduce((a, b) => a + b, 0);
        const deptsValue = deptsData.reduce((a, b) => a + b, 0);
        const value = chainValue - deptsValue;
        const index = networks.findIndex(data => data.name === chain);
        networks[index].balanceUsd += value;
    }

    const allProtocols = [...new Set(allData.map(({ protocol }) => protocol || "").filter(protocol => Boolean(protocol)))];
    const protocols: IData[] = allProtocols.map(protocol => ({ name: protocol, images: [ZAPPER_PROTOCOL_IMAGE(protocol)], isToken: false, balanceUsd: 0, price: 0, address: "" }));
    for (const protocol of allProtocols) {
        const protocolData = allData.filter(data => data.protocol === protocol).map(({ balanceUsd }) => balanceUsd);
        const deptsData = zapper.debt.filter(data => data.protocol === protocol).map(({ balanceUsd }) => balanceUsd);
        const protocolValue = protocolData.reduce((a, b) => a + b, 0);
        const deptValue = deptsData.reduce((a, b) => a + b, 0);
        const value = protocolValue - deptValue;
        const index = protocols.findIndex(data => data.name === protocol);
        protocols[index].balanceUsd += value;
    }

    return {
        total,
        wallet: clearForHideToken(wallet),
        vaults: clearForHideToken(zapper.vaults),
        leveragedPosition: clearForHideToken(zapper.leveragedPosition),
        liquidityPool: clearForHideToken(zapper.liquidityPool),
        debt: clearForHideToken(zapper.debt),
        claimable: clearForHideToken(zapper.claimable),
        farm: clearForHideToken(zapper.farm),
        networks: sort(networks, "balanceUsd"),
        protocols: sort(protocols, "balanceUsd"),
    };
}
