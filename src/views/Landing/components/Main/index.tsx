import React from "react";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
// import TridentWordmark from "../../../../assets/icons/Wordmark.png";
import TridentWordmark from "../../../../assets/icons/TridentWordmark.png";
import testButton from "../../../../assets/buttons/test-button-01.svg";
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
            {/*<div className="landing-main-btns-wrap">
                <RouterLink to="/game">
                    <div className="landing-main-btn">
                        <h5>Enter Atlantis</h5>
                    </div>
                </RouterLink>
            </div>*/    }
            <RouterLink to="/game">
                    <div className="landing-main-btn-svg">
                        {/* Custom Button SVG */}
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 671 167">
                            <g>
                                <image href="../../../../assets/images/gritty_green.PNG" className="btn-background-img" d="M53.4,164c-2.2,0-4.2-1.2-5.3-3.1L5.2,86.6c-1.1-1.9-1.1-4.3,0-6.2L48.1,6.1C49.2,4.2,51.3,3,53.4,3h563.8
                                    c2.2,0,4.2,1.2,5.3,3.1l42.9,74.3c1.1,1.9,1.1,4.3,0,6.2l-42.9,74.3c-1.1,1.9-3.1,3.1-5.3,3.1H53.4z"/>
                                <path className="btn-background" d="M53.4,164c-2.2,0-4.2-1.2-5.3-3.1L5.2,86.6c-1.1-1.9-1.1-4.3,0-6.2L48.1,6.1C49.2,4.2,51.3,3,53.4,3h563.8
                                    c2.2,0,4.2,1.2,5.3,3.1l42.9,74.3c1.1,1.9,1.1,4.3,0,6.2l-42.9,74.3c-1.1,1.9-3.1,3.1-5.3,3.1H53.4z"/>
                                <path className="btn-border" d="M617.3,6c1.1,0,2.2,0.6,2.7,1.6l42.9,74.3c0.6,1,0.6,2.2,0,3.2L620,159.4c-0.6,1-1.6,1.6-2.7,1.6H53.4
                                    c-1.1,0-2.2-0.6-2.7-1.6L7.8,85.1c-0.6-1-0.6-2.2,0-3.2L50.7,7.6c0.6-1,1.6-1.6,2.7-1.6H617.3 M617.3,0H53.4
                                    c-3.3,0-6.3,1.7-7.9,4.6L2.6,78.9c-1.6,2.8-1.6,6.3,0,9.2l42.9,74.3c1.6,2.8,4.7,4.6,7.9,4.6h563.8c3.3,0,6.3-1.7,7.9-4.6
                                    l42.9-74.3c1.6-2.8,1.6-6.3,0-9.2L625.2,4.6C623.6,1.7,620.6,0,617.3,0L617.3,0z"/>
                                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" className="btn-text">Enter Atlantis</text>
                            </g>
                        </svg>
                    </div>
                    
                </RouterLink>
        </div>
    );
}

export default Main;
