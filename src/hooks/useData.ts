import { useMemo } from "react";
import { mergeData } from "src/helpers/dataSource";
import { DataSource } from "./types";
import { useChainList } from "./useChainList";
import { IZapperData } from "src/store/slices/app-slice";

export const useDataSource = (data: IZapperData): DataSource => {
    const chainList = useChainList();
    return useMemo(() => mergeData(data, { wallet: [], vaults: [], leveragedPosition: [], liquidityPool: [], claimable: [], debt: [], farm: [] }, chainList), [chainList]);
};
