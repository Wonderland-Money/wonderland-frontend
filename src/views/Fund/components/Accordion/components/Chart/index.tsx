import { Grid } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { DataEntry } from "react-minimal-pie-chart/types/commonTypes";
import { IData } from "src/hooks/types";
import Card from "./components/ChartCard";
import stc from "string-to-color";
import hexToRgba from "hex-to-rgba";
import "./chart.scss";

interface IChart {
    total: number;
    data: IData[];
}

export interface IChartData {
    row: IData;
    chart: DataEntry;
    extra: {
        color: string;
        percent: number;
    };
}

function Chart({ data, total }: IChart) {
    const [selected, setSelected] = useState<number | null>(null);

    const chartData = useMemo<IChartData[]>(
        () =>
            data.map((row, index) => {
                const { name, address, balanceUsd, price } = row;
                const amount = balanceUsd || price;
                const value = Math.floor((amount * 100) / total);
                const color = stc(address || name);
                const rgba = hexToRgba(color, selected === index ? "1" : "0.6");

                return {
                    row,
                    chart: {
                        title: `${name} ${new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        }).format(amount)}`,
                        color: rgba,
                        value,
                    },
                    extra: { percent: value, color },
                };
            }),
        [data, total, selected],
    );

    const lable = useMemo(() => (selected === null ? total : data[selected]?.balanceUsd || data[selected]?.price || total), [selected, data]);

    const handleCardSelect = (index: number) => setSelected(index === selected ? null : index);

    const segmentsStyle = { transition: "stroke .3s", cursor: "pointer" };

    return (
        <Grid className="chart-root" container spacing={2}>
            <Grid item xs={12} lg={6}>
                <div className="chart-wrap">
                    <PieChart
                        data={chartData.map(({ chart }) => chart)}
                        lineWidth={20}
                        className="chart"
                        label={({ x, y, dx, dy }) => (
                            <text
                                x={x}
                                y={y}
                                dx={dx}
                                dy={dy}
                                dominantBaseline="central"
                                textAnchor="middle"
                                style={{
                                    fontSize: "6px",
                                    fontFamily: "Montserrat SemiBold",
                                    fill: "#FFFFFF",
                                    fontWeight: 600,
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                }).format(lable)}
                            </text>
                        )}
                        labelPosition={0}
                        radius={PieChart.defaultProps.radius - 6}
                        onClick={(event, index) => handleCardSelect(index)}
                        segmentsStyle={index => {
                            return index === selected ? { ...segmentsStyle, strokeWidth: 11 } : segmentsStyle;
                        }}
                    />
                </div>
            </Grid>
            <Grid container item spacing={1} xs={12} lg={6}>
                {chartData.map((info, index) => (
                    <Grid item key={index} xs={12} md={6}>
                        <Card key={`${info.row.name}-${info.row.address}`} data={info} isActive={selected === index} handleSelect={() => handleCardSelect(index)} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}

export default Chart;
