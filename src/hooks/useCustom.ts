import { useMemo } from "react";
import { RawData } from "./types";
import { getCustomData } from "src/helpers/customData";

export const useCustom = () => {
    const rawData = getCustomData();

    return useMemo<RawData>(() => {
        const wallet = rawData.wallet;

        return {
            wallet: wallet || [],
            vaults: [],
            leveragedPosition: [],
            liquidityPool: [],
            claimable: [],
            debt: [],
            farm: [],
        };
    }, [rawData]);
};
