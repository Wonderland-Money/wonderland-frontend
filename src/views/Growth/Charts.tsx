import React from "react";
import { useGrowthData } from "./useGrowthData";
import "./growth.scss";
import { GrowthChart } from "./GrowthChart";
import { GrowthDataPoint } from "./types";

const SOURCES_1: (keyof GrowthDataPoint)[] = ["treasuryMIMMarketValue"];
const SOURCES_2: (keyof GrowthDataPoint)[] = [
    "treasuryMIMMarketValue",
    "treasuryMIMFromTIMEMIMJLP",
    "treasuryMIMFromWETHMIMJLP",
    "treasuryWAVAXMarketValue",
    "treasuryWETHMarketValue",
    "treasuryWETHValueFromWETHMIMJLP",
];

export const Charts = () => {
    const data = useGrowthData();

    return (
        <div className="container">
            <h3>Growth</h3>
            {data && (
                <div className="charts-container">
                    <div className="flex-member">
                        <GrowthChart data={data} sources={SOURCES_1} title="Treasury Risk-Free Value" />
                    </div>
                    <div className="flex-member">
                        <GrowthChart data={data} sources={SOURCES_2} title="Total treasury assets" />
                    </div>
                </div>
            )}
        </div>
    );
};
