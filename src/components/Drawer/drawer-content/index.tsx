import { useCallback, useState } from "react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { ReactComponent as StakeIcon } from "../../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../../assets/icons/bond.svg";
import TridentIcon from "../../../assets/icons/trident-nav-header2.svg";
import { ReactComponent as DashboardIcon } from "../../../assets/icons/dashboard.svg";
import { ReactComponent as DocsIcon } from "../../../assets/icons/docs.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Link, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";

import classnames from "classnames";

function NavContent() {
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
            <div className="branding-header">
                {address && (
                    <div className="wallet-link">
                        <Link href={`https://explorer.harmony.one/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>
            <div className="dapp-menu-doc-link">
                <Link href="https://tridentdao.gitbook.io/trident-dao/" target="_blank">
                    <SvgIcon component={DocsIcon} />
                    <p>Docs</p>
                </Link>
            </div>
        </div>
    );
}

export default NavContent;
