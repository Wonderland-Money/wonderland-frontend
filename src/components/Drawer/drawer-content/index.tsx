import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import StakeIcon from "../../../assets/icons/stake.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import WonderlandIcon from "../../../assets/icons/wonderland-nav-header.svg";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress, useWeb3Context } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import DocsIcon from "../../../assets/icons/stake.svg";
import GlobeIcon from "../../../assets/icons/wonderglobe.svg";
import classnames from "classnames";
import BridgeIcon from "../../../assets/icons/bridge-alt.svg";
import { Networks, VIEWS_FOR_NETWORK } from "../../../constants";
import BlogIcon from "../../../assets/icons/medium.svg";
import FundIcon from "../../../assets/icons/fund.png";
import RedemptionIcon from "../../../assets/icons/redemption.svg";
import FarmIcon from "../../../assets/icons/farm.svg";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();
    const { bonds } = useBonds();
    const { chainID } = useWeb3Context();

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
        if (currentPath.indexOf("farm") >= 0 && page === "farm") {
            return true;
        }
        if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
            return true;
        }
        if (currentPath.indexOf("bridge") >= 0 && page === "bridge") {
            return true;
        }
        if (currentPath.indexOf("fund") >= 0 && page === "fund") {
            return true;
        }
        if (currentPath.indexOf("blog") >= 0 && page === "blog") {
            return true;
        }
        if (currentPath.indexOf("redemption") >= 0 && page === "redemption") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <Link href="https://wonderland.money" target="_blank">
                    <img alt="" src={WonderlandIcon} />
                </Link>

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
                    {VIEWS_FOR_NETWORK[chainID].dashboard && (
                        <Link
                            component={NavLink}
                            to="/dashboard"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "dashboard");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={DashboardIcon} />
                                <p>Dashboard</p>
                            </div>
                        </Link>
                    )}

                    {VIEWS_FOR_NETWORK[chainID].stake && (
                        <Link
                            component={NavLink}
                            to="/stake"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "stake");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={StakeIcon} />
                                <p>Stake</p>
                            </div>
                        </Link>
                    )}

                    {VIEWS_FOR_NETWORK[chainID].mints && (
                        <Link
                            component={NavLink}
                            id="bond-nav"
                            to="/mints"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "mints");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={BondIcon} />
                                <p>{chainID === Networks.AVAX ? "Mint" : "Treasury sales"}</p>
                            </div>
                        </Link>
                    )}

                    {VIEWS_FOR_NETWORK[chainID].mints && (
                        <div className="bond-discounts">
                            <p>{chainID === Networks.AVAX ? "Mint" : "Treasury sale"} discounts</p>
                            {bonds.map((bond, i) => {
                                if (bond.getAvailability(chainID)) {
                                    return (
                                        <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                            {!bond.bondDiscount ? (
                                                <Skeleton variant="text" width={"150px"} />
                                            ) : (
                                                <p className={classnames({ deprecated: bond.deprecated })}>
                                                    {bond.displayName}
                                                    {bond.deprecated ? (
                                                        <p className="bond-pair-roi">0%</p>
                                                    ) : (
                                                        <p className="bond-pair-roi">{bond.soldOut ? "Sold out" : bond.bondDiscount && `${trim(bond.bondDiscount * 100, 2)}%`}</p>
                                                    )}
                                                </p>
                                            )}
                                        </Link>
                                    );
                                }
                            })}
                        </div>
                    )}

                    {VIEWS_FOR_NETWORK[chainID].calculator && (
                        <Link
                            component={NavLink}
                            to="/calculator"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "calculator");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={GlobeIcon} />
                                <p>Calculator</p>
                            </div>
                        </Link>
                    )}

                    <Link
                        component={NavLink}
                        to="/bridge"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "bridge");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={BridgeIcon} />
                            <p>Bridge</p>
                        </div>
                    </Link>

                    {VIEWS_FOR_NETWORK[chainID].farm && (
                        <Link
                            component={NavLink}
                            id="farm-nav"
                            to="/farm"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "farm");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={FarmIcon} />
                                <p>Farm</p>
                            </div>
                        </Link>
                    )}
                    {VIEWS_FOR_NETWORK[chainID].fund && (
                        <Link
                            component={NavLink}
                            to="/fund"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "fund");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={FundIcon} />
                                <p>Fund</p>
                            </div>
                        </Link>
                    )}

                    <Link
                        component={NavLink}
                        to="/blog"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "blog");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={BlogIcon} />
                            <p>Blog</p>
                        </div>
                    </Link>

                    {VIEWS_FOR_NETWORK[chainID].redemption && (
                        <Link
                            component={NavLink}
                            to="/redemption"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "redemption");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={RedemptionIcon} />
                                <p>Redemption</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
            <div className="dapp-menu-doc-link">
                <Link href="https://wonderland.gitbook.io/wonderland/" target="_blank">
                    <img alt="" src={DocsIcon} />
                    <p>Docs</p>
                </Link>
            </div>
            <Social />
        </div>
    );
}

export default NavContent;
