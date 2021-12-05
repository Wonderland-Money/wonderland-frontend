import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-title-wrap">
                <p>Cupcake</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Reserve Currency of Binance Smart Chain</p>
            </div>
            <div className="landing-main-btns-wrap">
                <Link href="http://app.localhost:3000" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Enter App</p>
                    </div>
                </Link>
                <Link href="https://cupcake.gitbook.io/cupcake/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Main;
