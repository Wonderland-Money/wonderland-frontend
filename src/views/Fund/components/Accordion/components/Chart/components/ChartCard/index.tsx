import React from "react";
import "./card.scss";
import { IChartData } from "../../index";
import classNames from "classnames";

interface IChartCard {
    data: IChartData;
    isActive: boolean;
    handleSelect: () => void;
}

function ChartCard({ data, isActive, handleSelect }: IChartCard) {
    const { row, extra } = data;
    const { images, name, price, balanceUsd, chainUrl, protocolUrl } = row;
    const { percent, color } = extra;

    return (
        <div className={classNames("chart-card-view", { active: isActive })} onClick={handleSelect}>
            <div className="chart-card-view-img-container">
                {chainUrl && (
                    <div className="card-view-network-wrap">
                        <img alt="" src={chainUrl} />
                    </div>
                )}
                {images.map((image, index) => (
                    <img key={index} className="chart-card-view-img" alt="" src={image} />
                ))}
                {protocolUrl && (
                    <div className="card-view-protocol-wrap">
                        <img alt="" src={protocolUrl} />
                    </div>
                )}
            </div>
            <div className="chart-card-view-name-container">
                <p className="chart-card-view-name-container-title">{name}</p>
                <p className="chart-card-view-name-container-value">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                    }).format(balanceUsd || price)}
                </p>
                <p className="chart-card-view-name-container-value">({percent}%)</p>
            </div>
            <div className="chart-card-view-dot-wrap">
                <div className="chart-card-view-dot" style={{ background: color }} />
            </div>
        </div>
    );
}

export default ChartCard;
