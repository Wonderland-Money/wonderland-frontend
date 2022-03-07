import React from "react";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import "./main.scss";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-title-wrap">
                <p>Welcome to Atlantis // REPLACE</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Trident dives deeper than others are willing.</p>
                <p>Safeguarding your treasures & our vision,</p>
                <p>all hands on deck, we decsend on one mission;</p>
                <p>offer a fruitful and sustainable </p>
                <p>financial opportunity where others run aground.</p>
            </div>
            <div className="landing-main-btns-wrap">
                <RouterLink to="/stake">
                    <div className="landing-main-btn">
                        <p>Enter Atlantis</p>
                    </div>
                </RouterLink>
                <Link href="https://tridentdao.gitbook.io/trident-dao/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn secondary">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Main;
