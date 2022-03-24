import React from "react";
import Background from "../../views/Landing/components/Background";
import TridentWordmark from "../../assets/icons/TridentWordmark.png";
import TridentLogo from "../../assets/icons/Logo.png";
import { Link, Box } from "@material-ui/core";
import "./mobile.scss";

function Mobile() {
    return (
        <>
            <div className="mobile-wrap">
                <Background />
                <div className="mobile-header">
                    <img src={TridentLogo} />
                    <div className="header-nav-box">
                        <Link href="https://github.com/0xMaaz/trident-frontend" target="_blank">
                            <span className="header-nav-text">GitHub</span>
                        </Link>
                        <Link href="https://twitter.com/TridentDAO?s=20" target="_blank">
                            <span className="header-nav-text">Twitter</span>
                        </Link>
                        <Link href="https://discord.gg/4ZSaZvMGtQ" target="_blank">
                            <span className="header-nav-text">Discord</span>
                        </Link>
                    </div>
                </div>
                <div className="mobile-flex-container">
                    <img className="mobile-wordmark" src={TridentWordmark} />
                    <div className="mobile-text-wrap">
                        <p>At this time, Trident can only be experienced on desktop devices.</p>
                        <p className="mbl-subtext">The mobile release of Trident is in progress, follow the Twitter & Medium for important game updates.</p>
                    </div>
                    <div className="mobile-btn-wrap">
                        <a className="mbl-button" href={`https://twitter.com/TridentDAO`}>
                            <p>Twitter</p>
                        </a>
                        <a className="mbl-button" href={`https://https://medium.com/@Trident_GameFi/`}>
                            <p>Medium</p>
                        </a>
                    </div>
                </div>
                {/**
                 * <img logo>
                 *
                 * <p>Trident can only be experienced in a desktop environment</p>
                 *
                 * <p>A mobile release of Trident is in progress, follow project updated on <link twitter>our twitter</link></p>
                 */}
            </div>
        </>
    );
}

export default Mobile;
