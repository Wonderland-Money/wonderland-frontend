import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Social from "./social";
import BondIcon from "../../../assets/icons/bond.svg";
import WealthHeaderLogo from "../../../assets/icons/wealth-nav-header.svg";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import GlobeIcon from "../../../assets/icons/wonderglobe.svg";
import StakeIcon from "../../../assets/icons/stake.svg";
import DashboardYellowIcon from "../../../assets/icons/dashboard_yellow.svg";
import GlobeYellowIcon from "../../../assets/icons/wonderglobe_yellow.svg";
import StakeYellowIcon from "../../../assets/icons/stake_yellow.svg";
import BondYellowIcon from "../../../assets/icons/bond_yellow.svg";
import SidebarClose from "../../../assets/icons/sidebarClose.png";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
// import useBonds from "../../../hooks/bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import DocsIcon from "../../../assets/icons/docsIcon.svg";
import BuyIcon from "../../../assets/icons/buyIcon.svg";
import GovernanceIcon from "../../../assets/icons/governanceIcon.svg";
import ClickedIcon from "../../../assets/icons/clickIcon.svg";
import ClickedDownIcon from "../../../assets/icons/down.svg";
import classnames from "classnames";

interface INavDrawer {
    handleDrawerToggle?: () => void;
}

function NavContent({ handleDrawerToggle }: INavDrawer) {
    const [isActive] = useState();
    const address = useAddress();
    // const { bonds } = useBonds();
    const [bonds, setBonds] = useState<any>([]);
    const [locationPath, setLocationPath] = useState<any>("");
    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        setBonds([
            { displayName: "OHM-FRAX LP", bondDiscount: 5.21 },
            { displayName: "FRAX", bondDiscount: 4.27 },
        ]);
    }, []);

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            setLocationPath("dashboard");
            return true;
        }
        if (currentPath.indexOf("stake") >= 0 && page === "stake") {
            setLocationPath("stake");
            return true;
        }
        if (currentPath.indexOf("bonds") >= 0 && page === "bonds") {
            setLocationPath("bonds");
            return true;
        }
        if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
            setLocationPath("calculator");
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <div className="mobile-shown">
                    <div className="mouse-cursor" onClick={() => history.push("/dash/dashboard")}>
                        <img alt="" src={WealthHeaderLogo} />
                    </div>
                    <div className="icon-close" onClick={() => (handleDrawerToggle ? handleDrawerToggle() : null)}>
                        <img src={SidebarClose} alt="sidebar close" />
                    </div>
                </div>

                {address && (
                    <div className="wallet-link">
                        <Link href={`https://cchain.explorer.avax.network/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/dash/dashboard"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "dashboard");
                        }}
                        className={classnames("button-dapp-menu ", location?.pathname && location?.pathname.includes("dashboard") ? "active-btn" : "", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={locationPath === "dashboard" ? DashboardYellowIcon : DashboardIcon} />
                            <p>Dashboard</p>
                        </div>
                        {locationPath === "dashboard" && (
                            <div className="dapp-clicked">
                                <img src={ClickedIcon} alt="" />
                            </div>
                        )}
                    </Link>

                    <Link
                        component={NavLink}
                        to="/dash/stake"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "stake");
                        }}
                        className={classnames("button-dapp-menu ", location?.pathname && location?.pathname.includes("stake") ? "active-btn" : "", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={locationPath === "stake" ? StakeYellowIcon : StakeIcon} />
                            <p>Stake</p>
                        </div>
                        {locationPath === "stake" && (
                            <div className="dapp-clicked">
                                <img src={ClickedIcon} alt="" />
                            </div>
                        )}
                    </Link>

                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/dash/bonds"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "bonds");
                        }}
                        className={classnames("button-dapp-menu", location?.pathname && location?.pathname.includes("bond") ? "active-btn" : "", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={locationPath === "bonds" ? BondYellowIcon : BondIcon} />
                            <p>Bond</p>
                            <div className="dapp-clicked-down">
                                <img src={ClickedDownIcon} alt="" />
                            </div>
                        </div>
                    </Link>

                    <div className="bond-discounts">
                        <p>Bond discounts</p>
                        {/*{bonds.map((bond, i) => (*/}
                        {/*    <Link component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>*/}
                        {/*        {!bond.bondDiscount ? (*/}
                        {/*            <Skeleton variant="text" width={"150px"} />*/}
                        {/*        ) : (*/}
                        {/*            <p>*/}
                        {/*                {bond.displayName}*/}
                        {/*                <span className="bond-pair-roi">{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>*/}
                        {/*            </p>*/}
                        {/*        )}*/}
                        {/*    </Link>*/}
                        {/*))}*/}
                        {bonds.map((bond: any, i: number) => (
                            <Link component={NavLink} to={`/dash/bonds`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        <span className="bond-pair-roi">{bond.bondDiscount}%</span>
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                    <a href="#" target="_blank" className={classnames("button-dapp-menu", { active: isActive })}>
                        <div className="dapp-menu-item">
                            <img alt="" src={BuyIcon} />
                            <p>Buy</p>
                        </div>
                    </a>
                    {/*<Link*/}
                    {/*    component={NavLink}*/}
                    {/*    to="/dash/calculator"*/}
                    {/*    isActive={(match: any, location: any) => {*/}
                    {/*        return checkPage(location, "calculator");*/}
                    {/*    }}*/}
                    {/*    className={classnames("button-dapp-menu", location?.pathname && location?.pathname.includes("calculator") ? "active-btn" : "", { active: isActive })}*/}
                    {/*>*/}
                    {/*    <div className="dapp-menu-item">*/}
                    {/*        <img alt="" src={locationPath === "calculator" ? GlobeYellowIcon : GlobeIcon} />*/}
                    {/*        <p>Calculator</p>*/}
                    {/*    </div>*/}
                    {/*    {locationPath === "calculator" && (*/}
                    {/*        <div className="dapp-clicked">*/}
                    {/*            <img src={ClickedIcon} alt="" />*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</Link>*/}
                    <a href="#" target="_blank" className={classnames("button-dapp-menu", { active: isActive })}>
                        <div className="dapp-menu-item">
                            <img alt="" src={GovernanceIcon} />
                            <p>Governance</p>
                        </div>
                    </a>
                    <a
                        href="https://commonwealthdao.gitbook.io/docs/welcome-to-commonwealth/foundation"
                        target="_blank"
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={DocsIcon} />
                            <p>Docs</p>
                        </div>
                    </a>
                </div>
            </div>
            <div className="dapp-menu-doc-link" />
            <Social />
        </div>
    );
}

export default NavContent;
