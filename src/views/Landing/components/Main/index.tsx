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
                <p>Diving deeper than others are willing, in search of a stronghold,</p>
                <p>safeguarding our treasures & vision, for a fruitful and sustainable</p>
                <p>financial opportunity.</p>
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
