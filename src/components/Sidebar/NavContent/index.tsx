import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "../Social";
import externalUrls from "./external-urls";
import { ReactComponent as StakeIcon } from "../../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../../assets/icons/bond.svg";
import { ReactComponent as WonderlandIcon } from "../../../assets/icons/wonderland-nav-header.svg";
import { ReactComponent as DashboardIcon } from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress, useBonds } from "../../../hooks";
import { Paper, Link, Box, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "../sidebar.scss";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const bonds = useBonds();

  const checkPage = useCallback((location: any, page: string): boolean => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("mints") >= 0 || currentPath.indexOf("choose_mint") >= 0) && page === "mints") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://wonderland.money" target="_blank">
              <SvgIcon
                color="primary"
                component={WonderlandIcon}
                viewBox="0 0 130 60"
                //@ts-ignore
                style={{ minWdth: "130px", minHeight: "56px", width: "130px" }}
              />
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://cchain.explorer.avax.network/address/${address}`} target="_blank">
                  <p>{shorten(address)}</p>
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={(match: any, location: any) => {
                  return checkPage(location, "dashboard");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <div className="dapp-menu-item">
                  <SvgIcon color="primary" component={DashboardIcon} />
                  <p>Dashboard</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/"
                isActive={(match: any, location: any) => {
                  return checkPage(location, "stake");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <div className="dapp-menu-item">
                  <SvgIcon color="primary" component={StakeIcon} />
                  <p>Stake</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="bond-nav"
                to="/mints"
                isActive={(match: any, location: any) => {
                  return checkPage(location, "mints");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <div className="dapp-menu-item">
                  <SvgIcon color="primary" component={BondIcon} />
                  <p>Mint</p>
                </div>
              </Link>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <p>Mint discounts</p>
                  {bonds.map((bond, i) => (
                    <Link component={NavLink} to={`/mints/${bond.value}`} key={i} className={"bond"}>
                      {!bond.discount ? (
                        <Skeleton variant="text" width={"150px"} />
                      ) : (
                        <p>
                          {bond.name}
                          <span className="bond-pair-roi">{bond.discount && trim(bond.discount * 100, 2)}%</span>
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="flex-end" flexDirection="column">
          <div className="dapp-menu-external-links">
            {externalUrls.map((link, i) => {
              return (
                <Link key={i} href={link.url} target="_blank">
                  {link.icon}
                  <p>{link.title}</p>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
