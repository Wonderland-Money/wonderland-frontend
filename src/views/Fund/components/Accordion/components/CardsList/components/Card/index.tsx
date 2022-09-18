import React, { useState } from "react";
import "./card.scss";
import { trim } from "src/helpers";
import { IData } from "src/hooks/types";

function Card(props: IData) {
    const { images, name, price, balance, balanceUsd, chainUrl, protocolUrl, isToken } = props;

    return (
        <div>
            <div className="card-view">
                <div className="card-view-img-container">
                    {chainUrl && (
                        <div className="card-view-network-wrap">
                            <img alt="" src={chainUrl} />
                        </div>
                    )}
                    {images.map((image, index) => (
                        <img key={index} className="card-view-img" alt="" src={image} />
                    ))}
                    {protocolUrl && (
                        <div className="card-view-protocol-wrap">
                            <img alt="" src={protocolUrl} />
                        </div>
                    )}
                </div>
                <div className="card-view-name-container">
                    <p className="card-view-name-container-title">{name}</p>
                    <p className="card-view-name-container-value">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        }).format(isToken ? price : balanceUsd)}
                    </p>
                </div>
                {isToken && (
                    <div className="card-view-tokens-container">
                        <p className="card-view-tokens-container-title">
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(balanceUsd)}
                        </p>
                        <p className="card-view-tokens-container-value">{trim(balance, 4)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;
