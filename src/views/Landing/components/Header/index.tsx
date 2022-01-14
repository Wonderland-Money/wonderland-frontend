import React, { useState } from "react";
import "./header.scss";
import { SvgIcon } from "@material-ui/core";
import Social from "../../../../components/Drawer/drawer-content/social";
import { useHistory } from "react-router-dom";
import { ReactComponent as WealthLogoIcon } from "../../../../assets/icons/wealthLogo.svg";
import { ReactComponent as MobileLandingLogo } from "../../../../assets/icons/mobileLandingLogo.svg";

import { useSelector } from "react-redux";
import { IReduxState } from "../../../../store/slices/state.interface";
import { trim } from "../../../../helpers";

function Header() {
    const history = useHistory();
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    const marketPrice = useSelector<IReduxState, number>(state => {
        return state.app.marketPrice;
    });
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
                        <div className="amount-percentage-txt">{marketPrice ? <>${new Intl.NumberFormat("en-US").format(Number(marketPrice))}</> : <span />}</div>
                    </div>
                    <div className="header-flex">
                        <div className="time-price-txt">Current APY</div>
                        <div className="amount-percentage-txt">{stakingAPY ? <>{Number(trimmedStakingAPY)}%</> : <span />}</div>
                    </div>
                </div>
                <Social />
            </div>
        </div>
    );
}

export default Header;
