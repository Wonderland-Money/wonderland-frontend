import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";
import CatImg from "../../../../assets/icons/Chershire_Cat.jpeg";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-img-wrap">
                <img src={CatImg} alt="" />
            </div>
            <div className="landing-main-btns-wrap">
                <Link href="https://app.wonderland.money" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Enter App</p>
                    </div>
                </Link>
                <Link href="https://wonderland.gitbook.io/wonderland/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
            <div className="landing-main-title-wrap">
                <p>The Defi</p>
                <p>WonderLand</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Financial tools to grow your wealth - stake</p>
                <p>and earn compounding interest</p>
            </div>
        </div>
    );
}

export default Main;
