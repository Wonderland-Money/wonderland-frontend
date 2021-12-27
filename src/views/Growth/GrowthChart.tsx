import React, { useCallback, useMemo, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartCard } from "./ChartCard";
import { formatCash, getCoinColors } from "./helpers";
import { GrowthDataPoint } from "./types";
import "./growth.scss";
import { Text } from "src/components/Text/Text";

export interface GrowthChartProps {
    sources: (keyof GrowthDataPoint)[]; // just get the datapoints
    data: GrowthDataPoint[];
    title: string;
}

const yAxisTickFormatter = (value: number) => {
    return `$${formatCash(value)}`;
};

const xAxisTickFormatter = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export const GrowthChart = ({ sources, data, title }: GrowthChartProps) => {
    const calculateTotal = useCallback((index: number) => {
        const datapoint = data[index];
        const valuesToSum = sources.map(key => datapoint[key]).filter(value => value != null);
        // @ts-ignore
        const sum: number = valuesToSum.reduce((prev, next) => prev + next, 0);
        return "$" + Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(sum);
    }, []);

    const initValue = useRef(calculateTotal(data.length - 1));
    const valueRef = useRef<HTMLSpanElement>(null);

    const handleMouseMove = useCallback((moveData: any) => {
        if (!valueRef.current) return;
        if (moveData.isTooltipActive) {
            // we're hovering something, lets calculate new totals
            valueRef.current.innerText = calculateTotal(moveData.activeTooltipIndex);
        } else {
            // we stopped hovering, reset to latest index
            valueRef.current.innerText = calculateTotal(data.length - 1);
        }
    }, []);

    return (
        <ChartCard title={title} valueRef={valueRef} initValue={initValue.current}>
            <ResponsiveContainer height="90%" width="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -5,
                        bottom: 24,
                    }}
                    onMouseMove={handleMouseMove}
                >
                    <defs>
                        {sources.map(key => {
                            const [color1, color2] = getCoinColors(key);
                            return (
                                <linearGradient id={key} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color1} />
                                    <stop offset="80%" stopColor={color2} />
                                </linearGradient>
                            );
                        })}
                    </defs>
                    <XAxis dataKey="timestamp" tickFormatter={xAxisTickFormatter} minTickGap={25} fontSize="13px" padding={{ right: 20 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={yAxisTickFormatter} axisLine={false} tickLine={false} fontSize="13px" />
                    <Tooltip />
                    {sources.map(key => {
                        return <Area type="monotone" dataKey={key} stackId="1" stroke="#000" strokeWidth={0} fill={`url(#${key})`} />;
                    })}
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
