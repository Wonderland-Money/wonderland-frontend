import React, { useCallback, useState } from "react";
import "./liquidity-banner.scss";
import { ReactComponent as xIcon } from "../../assets/icons/x.svg";
import { SvgIcon } from "@material-ui/core";
import CircleIcon from "../../assets/icons/circle.svg";

function LiquidityBanner() {
    const [showBanner, setShowBanner] = useState(true);

    const handleClose = useCallback(() => setShowBanner(false), []);

    if (!showBanner) {
        return null;
    }

    return (
        <div className="liquidity-banner-root">
            <div className="liquidity-banner-text-conteiner">
                <p className="liquidity-banner-text">
                    Liquidity has been migrated to{" "}
                    <a target="_blank" href="https://sushi.com/">
                        Sushi.com
                    </a>
                </p>
                <p className="liquidity-banner-text upper">
                    To buy and sell wMemo, please click{" "}
                    <a
                        target="_blank"
                        href="https://avalanche.sushi.com/swap?inputCurrency=0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b&outputCurrency=0x130966628846BFd36ff31a822705796e8cb8C18D"
                    >
                        here
                    </a>
                </p>
            </div>
            <div className="liquidity-banner-close-wrap" onClick={handleClose}>
                <SvgIcon color="primary" component={xIcon} />
            </div>
            <div className="liquidity-banner-left-circle">
                <img alt="" src={CircleIcon} />
            </div>
            <div className="liquidity-banner-right-circle">
                <img alt="" src={CircleIcon} />
            </div>
        </div>
    );
}

export default LiquidityBanner;
