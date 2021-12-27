import { GrowthDataPoint } from "./types";
import { useMemo } from "react";
import { useQuery } from "react-query";
import apollo from "src/helpers/apollo/apollo";
import { treasuryQuery } from "./TreasuryQueries";
import { mapDataPoint } from "./helpers";

const getTreasuryMetrics = (options: any) => {
    return useQuery(
        "treasury_metrics",
        async () => {
            const response = await apollo<any>(treasuryQuery);

            // Transform string values to floats
            //@ts-ignore
            return response.data.protocolMetrics.map((metric: any) => Object.entries(metric).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}));
        },
        options,
    );
};

// Returns a bunch of growth data in usable formats
export const useGrowthData = () => {
    const { data } = getTreasuryMetrics({ refetchOnMount: false });

    const mappedData: GrowthDataPoint[] | null = useMemo(() => {
        if (!data) return null;

        return data.map(mapDataPoint).reverse();
    }, [data]);

    return mappedData;
};
