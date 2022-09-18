import { DEBANK_CHAIN_LIST, WONDERLAND_TREASURY_BALANCE, ZAPPER_BALANCES_URL } from "../constants";
import { IZapperData } from "../hooks/useZapper";
import { AssetType, calcByType, HIDE_TOKENS } from "./zapper";
import { getWallet } from "./customData";
import axios from "axios";

// function parsed(data: string) {
//     let parsed: any = data.split("\n");
//     //@ts-ignore
//     parsed = parsed.filter(p => {
//         if (p.includes("event")) return false;
//         if (!p) return false;
//         return true;
//     });
//     parsed = parsed.join("");
//     parsed = parsed.split("data: ");
//     //@ts-ignore
//     parsed = parsed.map(p => {
//         try {
//             return JSON.parse(p);
//         } catch (err) {
//             return null;
//         }
//     });
//     //@ts-ignore
//     parsed = parsed.filter(p => Boolean(p));
//     return parsed;
// }

export const getFundTotal = async (): Promise<any> => {
    // const customWallet = await getWallet();
    // const chainList = await axios.get(DEBANK_CHAIN_LIST);
    const { data } = await axios.get(WONDERLAND_TREASURY_BALANCE);

    //@ts-ignore
    // const rawZapperData: IZapperData[] = parsed(data);

    // const wallet = calcByType(
    //     rawZapperData.filter(({ appId }) => appId === "tokens"),
    //     AssetType.WALLET,
    //     chainList.data,
    //     true,
    // );

    // const vaults = calcByType(
    //     rawZapperData.filter(({ appId }) => appId !== "tokens"),
    //     AssetType.VAULT,
    //     chainList.data,
    //     true,
    // );
    // let leveragedPosition = calcByType(
    //     rawZapperData.filter(({ appId }) => appId !== "tokens"),
    //     AssetType.LEVERAGED_POSITION,
    //     chainList.data,
    //     true,
    // );

    // const debt = leveragedPosition.filter(({ type }) => type === "debt");

    // leveragedPosition = leveragedPosition.filter(({ type }) => type === "collateral");

    // const liquidityPool = calcByType(
    //     rawZapperData.filter(({ appId }) => appId !== "tokens"),
    //     AssetType.LIQUIDITY_POOL,
    //     chainList.data,
    //     true,
    // );
    // const claimable = calcByType(
    //     rawZapperData.filter(({ appId }) => appId !== "tokens"),
    //     AssetType.CLAIMABLE,
    //     chainList.data,
    //     true,
    // );
    // const farm = calcByType(
    //     rawZapperData.filter(({ appId }) => appId !== "tokens"),
    //     AssetType.FARM,
    //     chainList.data,
    //     true,
    // );

    // let allAssets = [...wallet, ...vaults, ...leveragedPosition, ...liquidityPool, ...claimable, ...farm, ...customWallet];
    // allAssets = allAssets.map(asset => (asset.isToken ? asset : asset.tokens || [])).flat();
    // allAssets = allAssets.filter(asset => !HIDE_TOKENS.includes(asset.address.toLowerCase()));

    // const dataValue = allAssets.map(({ balanceUsd }) => balanceUsd).reduce((a, b) => a + b, 0);
    // const debtTotal = debt.map(({ balanceUsd }) => balanceUsd).reduce((a, b) => a + b, 0);

    return {
        total: data.balance,
        zapper: {},
    };
};
