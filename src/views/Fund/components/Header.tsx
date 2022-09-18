import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useMemo, useState } from "react";
import { DataSource } from "src/hooks/types";
import { PieChart } from "react-minimal-pie-chart";
import stc from "string-to-color";
import hexToRgba from "hex-to-rgba";
import classNames from "classnames";

import WalletIcon from "../../../assets/icons/wallet.svg";
import VaultIcon from "../../../assets/icons/vault.svg";
import FarmIcon from "../../../assets/icons/farm.svg";
import LiquidityPoolsIcon from "../../../assets/icons/liquidity-pools.svg";
import ClaimableIcon from "../../../assets/icons/claimable.svg";
import { sort } from "src/helpers/zapper";

interface HeaderProps {
    data: DataSource;
}

interface IChartCard {
    data: any;
    isActive: boolean;
    handleSelect: () => void;
}

function Card({ data, isActive, handleSelect }: IChartCard) {
    const { row, extra } = data;
    const { name, balance, icon } = row;
    const { percent, color } = extra;

    return (
        <div className={classNames("chart-card-view", { active: isActive })} onClick={handleSelect}>
            <div className="chart-card-view-img-container">
                <img className="chart-card-view-img" style={{ borderRadius: 0 }} alt="" src={icon} />
            </div>
            <div className="chart-card-view-name-container">
                <p className="chart-card-view-name-container-title">{name}</p>
                <p className="chart-card-view-name-container-value">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                    }).format(balance)}
                </p>
                <p className="chart-card-view-name-container-value">({percent}%)</p>
            </div>
            <div className="chart-card-view-dot-wrap">
                <div className="chart-card-view-dot" style={{ background: color }} />
            </div>
        </div>
    );
}

function Header({ data }: HeaderProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const handleCardSelect = (index: number) => setSelected(index === selected ? null : index);
    const segmentsStyle = { transition: "stroke .3s", cursor: "pointer" };

    let row = [
        { name: "Wallet", balance: Array.isArray(data.wallet) ? data.wallet.map(d => d.balanceUsd).reduce((a, b) => a + b, 0) : 0, icon: WalletIcon },
        { name: "Vaults", balance: Array.isArray(data.vaults) ? data.vaults.map(d => d.balanceUsd).reduce((a, b) => a + b, 0) : 0, icon: VaultIcon },
        {
            name: "Farm",
            balance: Array.isArray(data.farm) ? data.farm.map(d => d.balanceUsd).reduce((a, b) => a + b, 0) : 0,
            icon: FarmIcon,
        },
        { name: "Liquidity pool", balance: Array.isArray(data.liquidityPool) ? data.liquidityPool.map(d => d.balanceUsd).reduce((a, b) => a + b, 0) : 0, icon: LiquidityPoolsIcon },
        { name: "Claimable", balance: Array.isArray(data.claimable) ? data.claimable.map(d => d.balanceUsd).reduce((a, b) => a + b, 0) : 0, icon: ClaimableIcon },
    ];
    //@ts-ignore
    row = sort(row, "balance");

    const chartData = useMemo(
        () =>
            row.map((row, index) => {
                const { name, balance } = row;
                const value = Math.floor((balance * 100) / data.total);
                const color = stc(name);
                const rgba = hexToRgba(color, selected === index ? "1" : "0.6");

                return {
                    row,
                    chart: {
                        title: `${name} ${new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        }).format(balance)}`,
                        color: rgba,
                        value,
                    },
                    extra: { percent: value, color },
                };
            }),
        [row, data, selected],
    );

    const lable = useMemo(() => (selected === null ? data.total : row[selected]?.balance || data.total), [selected, row, data]);

    return (
        <div className="fund-infos-net-worth-container">
            <div className="fund-infos-net-worth-wrap">
                <p className="fund-infos-net-worth-wrap-title">Net Worth</p>
                <p className="fund-infos-net-worth-wrap-value">
                    {!data.total ? (
                        <Skeleton width="180px" />
                    ) : (
                        new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        }).format(data.total)
                    )}
                </p>
            </div>
            {data.total > 0 && (
                <Grid className="fund-infos-net-chart-container" container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <div className="fund-infos-net-chart-wrap">
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
                    <Grid container item xs={12} lg={6} spacing={1}>
                        {chartData.map((info, index) => (
                            <Grid item key={index} xs={12} md={6}>
                                <Card data={info} isActive={selected === index} handleSelect={() => handleCardSelect(index)} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}
        </div>
    );
}

export default Header;
