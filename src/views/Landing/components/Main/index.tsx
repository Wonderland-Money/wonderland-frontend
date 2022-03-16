import React from "react";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
// import TridentWordmark from "../../../../assets/icons/Wordmark.png";
import TridentWordmark from "../../../../assets/icons/TridentWordmark.png";
import "./main.scss";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-title-wrap">
                <img className="main-wordmark" src={TridentWordmark} />
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Trident dives deeper than others are willing. Safeguarding your treasures & our vision,</p>
                <p>all hands on deck, we descend on one mission; to offer a fruitful and sustainable </p>
                <p>financial opportunity where others run aground.</p>
            </div>
            <div className="landing-main-btns-wrap">
                <RouterLink to="/game">
                    <div className="landing-main-btn">
                        <h5>Enter Atlantis</h5>
                    </div>
                </RouterLink>
            </div>
        </div>
    );
}

export default Main;
