import { useCallback, useState } from "react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { ReactComponent as StakeIcon } from "../../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../../assets/icons/bond.svg";
import TridentIcon from "../../../assets/icons/trident-nav-header2.svg";
import { ReactComponent as DashboardIcon } from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../helpers";
import { useAddress } from "../../hooks";
import useBonds from "../../hooks/bonds";
import { Link, SvgIcon } from "@material-ui/core";
import SocialBar from "./social";
import "./drawer-content.scss";

import classNames from "classnames";

function Social(props: any) {
    const [isActive] = useState();
    const address = useAddress();
    const { bonds } = useBonds();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("stake") >= 0 && page === "stake") {
            return true;
        }
        if (currentPath.indexOf("mints") >= 0 && page === "mints") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className={classNames("dapp-menu-doc-link", { disabled: !props.socialIsOpen })}>
                <SocialBar />
            </div>
        </div>
    );
}

export default Social;
