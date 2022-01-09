import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "@material-ui/core";
import "./main.scss";
import HomeMainImg from "../../../../assets/icons/homeMain.png";
import RightDirect from "../../../../assets/icons/rightDirect.png";
import LeftDirect from "../../../../assets/icons/leftDirect.png";
import StepOne from "../../../../assets/icons/stepOne.png";
import StepTwo from "../../../../assets/icons/stepTwo.png";
import StepThree from "../../../../assets/icons/stepThree.png";
import StepFour from "../../../../assets/icons/stepFour.png";

import RoadMap1 from "../../../../assets/icons/roadmap1.png";
import RoadMap2 from "../../../../assets/icons/roadmap2.png";
import RoadMap3 from "../../../../assets/icons/roadmap3.png";
import RoadMap4 from "../../../../assets/icons/roadmap4.png";

import RightUp from "../../../../assets/icons/rightUp.png";
import RightDown from "../../../../assets/icons/rightDown.png";
import Left from "../../../../assets/icons/left.png";
import Line from "../../../../assets/icons/line.png";
import Stick from "../../../../assets/icons/stick.png";

import PersonImg from "../../../../assets/icons/person.png";

function Main() {
    const history = useHistory();
    return (
        <div className="landing-main">
            <div className="landing-main-img-wrap">
                <img src={HomeMainImg} alt="" />
            </div>
            <div className="interest-content">
                <div className="interest-title">Ever-Lasting Compounding Interest</div>
                <div className="interest-desc">Algorithmic tools built by the DeFi community, for the community.</div>
                <div className="interest-desc">Stake, bond, and continuously compound.</div>
            </div>
            <div className="landing-main-btns-wrap">
                <div onClick={() => history.push("/dash/dashboard")}>
                    <div className="landing-main-btn btn-col1">
                        <p>Enter the DAPP</p>
                    </div>
                </div>
                <Link href="https://commonwealthdao.gitbook.io/docs/welcome-to-commonwealth/foundation" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn btn-col2">
                        <p>Documentation</p>
                    </div>
                </Link>
                <Link href="https://discord.com/invite/mEWNuz55a7" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn btn-col3">
                        <div className="discord-btn">
                            <p>Discord</p>
                        </div>
                    </div>
                </Link>
            </div>
            {/* Arrows */}
            <div className="landing-main-directs">
                <div className="right-line">
                    <img className="line-w" src={RightDirect} alt="right" />
                </div>
                <div className="left-line">
                    <img className="line-w" src={LeftDirect} alt="left" />
                </div>
            </div>
            <img className="mobile-img" src={PersonImg} alt="person img" />
            <div className="landing-main-title-wrap">
                <p>
                    The CommonWealth <span className="underline-y">Pyramid</span>
                </p>
            </div>
            <div className="landing-step">
                <div className="">
                    <img className="step-num" src={StepOne} alt="step one" />
                    <div className="step-txt">Bonding increases the amount of bonded tokens in the treasury</div>
                </div>
                <div className="step-arrow-grid3">
                    <img className="right-arrow-w" src={RightUp} alt="right up arrow" />
                    <img className="person-bg" src={PersonImg} alt="person img" />
                    <img className="left-arrow-w" src={RightDown} alt="right down arrow" />
                </div>
                <div className="steps-arrows">
                    <img className="step-imgs" src={StepFour} alt="step four" />
                    <img className="left-arrows" src={Left} alt="right up arrow" />
                    <img className="step-imgs" src={StepThree} alt="step three" />
                    <img className="left-arrows" src={Left} alt="right up arrow" />
                    <img className="step-imgs" src={StepTwo} alt="step two" />
                </div>
                <div className="txt-grid3">
                    <div className="step-txt">The value of the treasury increases</div>
                    <div className="step-txt">Underlying value of $BLOCKS increases</div>
                    <div className="step-txt">The DAO utilizes bonded assets to generate yield</div>
                </div>
            </div>
            {/* Mobile Version*/}
            <div className="mobile-step shown600">
                <img className="step-num-img" src={StepOne} alt="step one" />
                <div className="step-txt-desc">Bonding increases the amount of bonded tokens in the treasury</div>
                <img className="step-num-img" src={StepTwo} alt="step two" />
                <div className="step-txt-desc">The DAO utilizes bonded assets to generate yield</div>
                <img className="step-num-img" src={StepThree} alt="step three" />
                <div className="step-txt-desc">Underlying value of $BLOCKS increases</div>
                <img className="step-num-img" src={StepFour} alt="step four" />
                <div className="step-txt-desc">The value of the treasury increases</div>
            </div>
            {/* Arrows */}
            <div className="landing-main-directs">
                <div className="right-line">
                    <img className="line-w" src={RightDirect} alt="right" />
                </div>
                <div className="left-line">
                    <img className="line-w" src={LeftDirect} alt="left" />
                </div>
            </div>
            <div className="landing-main-title-wrap">
                <p>
                    Roadmap <span className="underline-y">{new Date().getFullYear()}</span>
                </p>
            </div>
            <div className="landing-roadmap">
                <div className="roadmap-grid4">
                    <div>
                        <div>
                            <img className="step-num" src={RoadMap1} alt="step one" />
                        </div>
                        <div>
                            <img className="line1-t" src={Line} alt="line" />
                        </div>
                    </div>
                    <div className="stick2-txt">
                        <p>• Announce Partnerships</p>
                        <p>• Governance Snapshot</p>
                    </div>
                    <div>
                        <div>
                            <img className="step-num" src={RoadMap3} alt="step three" />
                        </div>
                        <div>
                            <img className="line1-t" src={Line} alt="line" />
                        </div>
                    </div>
                    <div className="stick2-txt">
                        <p>• Rebase Removal</p>
                        <p>• CEX Listing</p>
                    </div>
                </div>
                <div>
                    <img className="stick-w" src={Stick} alt="stick" />
                </div>
                <div className="roadmap-grid4">
                    <div className="stick1-txt">
                        <p>• Launch</p>
                        <p>• Multi-Chain</p>
                        <p>• Audited</p>
                        (Other DAOs are NOT)
                    </div>
                    <div>
                        <div>
                            <img className="line2-t" src={Line} alt="line" />
                        </div>
                        <div>
                            <img className="step-num" src={RoadMap2} alt="step two" />
                        </div>
                    </div>
                    <div className="stick1-txt product">
                        <p>• Product/Company Acquisitions (AAA Game Studio, Web3, Gambling)</p>
                    </div>
                    <div>
                        <div>
                            <img className="line2-t" src={Line} alt="line" />
                        </div>
                        <div>
                            <img className="step-num" src={RoadMap4} alt="step four" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Version*/}
            <div className="mobile-step shown768">
                <img className="step-num-img" src={RoadMap1} alt="step one" />
                <div className="step-txt-desc">
                    <p>• Launch</p>
                    <p>• Multi-Chain</p>
                    <p>• Audited (Other DAOs are NOT)</p>
                </div>
                <img className="step-num-img" src={RoadMap2} alt="step two" />
                <div className="step-txt-desc">
                    <p>• Announce Partnerships</p>
                    <p>• Governance Snapshot</p>
                </div>
                <img className="step-num-img" src={RoadMap3} alt="step three" />
                <div className="step-txt-desc">
                    <p>• Product/Company Acquisitions (AAA Game Studio, Web3, Gambling)</p>
                </div>
                <img className="step-num-img" src={RoadMap4} alt="step four" />
                <div className="step-txt-desc">
                    <p>• Rebase Removal</p>
                    <p>• CEX Listing</p>
                </div>
            </div>
        </div>
    );
}

export default Main;
