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
                <p className="liquidity-banner-text">Rebases have ended as per WIP 17, please now wrap your</p>
                <p className="liquidity-banner-text">MEMO to wMEMO and take advantage of our farm.</p>
                <p className="liquidity-banner-text upper">
                    More info{" "}
                    <a target="_blank" href="https://www.wonderlandforum.xyz/t/wip-17-stopping-rebases/19100">
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
