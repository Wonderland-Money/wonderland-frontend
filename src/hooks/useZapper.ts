import { useState, useEffect, useMemo } from "react";
import { ZAPPER_BALANCES_URL } from "../constants";
import { AssetType, calcByType } from "../helpers/zapper";
import { ChainInfo, RawData } from "./types";

interface IZapperDataBalanceMeta {
    value: number;
    type: string;
    label: string;
}

export interface IZapperDataBalanceProductAssetToken {
    address: string;
    appId?: string;
    balance: number;
    balanceRaw: string;
    balanceUSD: number;
    decimals: number;
    img?: string;
    label?: string;
    liquidity?: number;
    metaType?: string;
    network: string;
    price: number;
    pricePerShare?: number;
    supply?: number;
    tokens?: IZapperDataBalanceProductAssetToken[];
    symbol: string;
    type: string;
    volume?: number;
    share?: number;
}

interface IZapperDataBalanceProductAsset {
    type: string;
    balanceUSD: number;
    tokens: IZapperDataBalanceProductAssetToken[];
}

interface IZapperDataBalanceProduct {
    label: string;
    assets: IZapperDataBalanceProductAsset[];
}

interface IZapperDataBalance {
    meta: IZapperDataBalanceMeta[];
    products: IZapperDataBalanceProduct[];
}

export interface IZapperData {
    appId: string;
    network: string;
    balances: {
        [key: string]: IZapperDataBalance;
    };
}

export const useZapper = (chainList?: ChainInfo[]) => {
    const [rawZapperData, setRawZapperData] = useState<IZapperData[]>([]);

    useEffect(() => {
        const events = new EventSource(ZAPPER_BALANCES_URL);
        let rawZapperDatas: any[] = [];

        events.addEventListener("start", () => {
            rawZapperDatas = [];
        });

        events.addEventListener("balance", (event: any) => {
            const newData = JSON.parse(event.data);
            rawZapperDatas = [...rawZapperDatas, newData];
            setRawZapperData(rawZapperDatas);
        });

        events.addEventListener("end", () => {
            setRawZapperData(rawZapperDatas);
            events.close();
        });

        return () => events.close();
    }, []);

    return useMemo<RawData>(() => {
        const wallet = calcByType(
            rawZapperData.filter(({ appId }) => appId === "tokens"),
            AssetType.WALLET,
            chainList,
        );

        const vaults = calcByType(
            rawZapperData.filter(({ appId }) => appId !== "tokens"),
            AssetType.VAULT,
            chainList,
        );
        const leveragedPosition = calcByType(
            rawZapperData.filter(({ appId }) => appId !== "tokens"),
            AssetType.LEVERAGED_POSITION,
            chainList,
        );
        const liquidityPool = calcByType(
            rawZapperData.filter(({ appId }) => appId !== "tokens"),
            AssetType.LIQUIDITY_POOL,
            chainList,
        );
        const claimable = calcByType(
            rawZapperData.filter(({ appId }) => appId !== "tokens"),
            AssetType.CLAIMABLE,
            chainList,
        );
        const farm = calcByType(
            rawZapperData.filter(({ appId }) => appId !== "tokens"),
            AssetType.FARM,
            chainList,
        );

        return {
            wallet,
            vaults,
            leveragedPosition: leveragedPosition.filter(({ type }) => type === "collateral"),
            liquidityPool,
            claimable: claimable.concat(...farm.filter(({ type }) => type === "claimable")),
            debt: leveragedPosition.filter(({ type }) => type === "debt"),
            farm: farm.filter(({ type }) => type !== "claimable"),
        };
    }, [rawZapperData]);
};
