import React from "react";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import "./main.scss";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-title-wrap">
                <p>The Decentralized</p>
                <p>Trident</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Financial tools to grow your wealth - stake</p>
                <p>and earn compounding interest</p>
            </div>
            <div className="landing-main-btns-wrap">
                <RouterLink to="/stake">
                    <div className="landing-main-btn">
                        <p>Enter Atlantis</p>
                    </div>
                </RouterLink>
                <Link href="https://trident.gitbook.io/trident/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn secondary">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Main;
