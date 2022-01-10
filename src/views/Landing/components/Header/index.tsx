import React, { useState } from "react";
import "./header.scss";
import { SvgIcon, Link, Box, Popper, Fade } from "@material-ui/core";
import Social from "../../../../components/Drawer/drawer-content/social";
import { useHistory } from "react-router-dom";
import { ReactComponent as WealthLogoIcon } from "../../../../assets/icons/wealthLogo.svg";
import { ReactComponent as MobileLandingLogo } from "../../../../assets/icons/mobileLandingLogo.svg";
import { ReactComponent as Twitter } from "../../../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../../../assets/icons/discord.svg";
import { ReactComponent as GitBook } from "../../../../assets/icons/gitBook.svg";
import { ReactComponent as MIcon } from "../../../../assets/icons/mIcon.svg";
import { useSelector } from "react-redux";
import { IReduxState } from "../../../../store/slices/state.interface";
import { trim } from "../../../../helpers";
import { Skeleton } from "@material-ui/lab";

function Header() {
    const history = useHistory();
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    return (
        <div className="landing-header">
            <SvgIcon
                color="primary"
                className="mobile-hidden"
                component={WealthLogoIcon}
                viewBox="0 0 200 67"
                style={{ minWidth: 200, minHeight: 67, cursor: "pointer" }}
                onClick={() => history.push("/dash/dashboard")}
            />
            <SvgIcon
                color="primary"
                className="mobile-shown"
                component={MobileLandingLogo}
                viewBox="0 0 140 46"
                style={{ minWidth: 140, minHeight: 46 }}
                onClick={() => history.push("/dash/dashboard")}
            />
            <div className="landing-header-nav-wrap">
                <div className="header-block">
                    <div className="header-flex">
                        <div className="time-price-txt">BLOCKS Price</div>
                        <div className="amount-percentage-txt">$4259.14</div>
                    </div>
                    <div className="header-flex">
                        <div className="time-price-txt">Current APY</div>
                        <div className="amount-percentage-txt">{stakingAPY ? <>{new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%</> : <span />}</div>
                    </div>
                </div>
                <Social />
            </div>
        </div>
    );
}

export default Header;
