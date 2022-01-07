import { useLocation } from "react-router-dom";
import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "../../assets/icons/hamburger.svg";
import TimeMenu from "./time-menu";
import ConnectButton from "./connect-button";
import WrapButton from "./wrap-button";
import "./header.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import { useEffect, useState } from "react";

interface IHeader {
    handleDrawerToggle: () => void;
    drawe: boolean;
}

const useStyles = makeStyles(theme => ({
    appBar: {
        [theme.breakpoints.up("sm")]: {
            width: "100%",
            padding: "32px 0 24px 0",
        },
        justifyContent: "flex-end",
        alignItems: "flex-end",
        background: "transparent",
        backdropFilter: "none",
        zIndex: 10,
    },
    topBar: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: DRAWER_WIDTH,
    },
    topBarShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function Header({ handleDrawerToggle, drawe }: IHeader) {
    const classes = useStyles();
    const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
    const isWrapShow = useMediaQuery("(max-width: 480px)");
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState<any>("");
    useEffect(() => {
        if (location && location.pathname) setCurrentPath(location.pathname);
    }, [location]);
    return (
        <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
            <AppBar position="sticky" className={classes.appBar} elevation={0}>
                <Toolbar disableGutters className="dapp-topbar">
                    {/*<div onClick={handleDrawerToggle} className="dapp-topbar-slider-btn">*/}
                    {/*    <img src={MenuIcon} alt="" />*/}
                    {/*</div>*/}
                    <div className="dapp-topbar-btns-wrap">
                        {currentPath === "/dash/dashboard" ? (
                            <div className="buy-menu-root">
                                <div className="buy-menu-btn">
                                    <p>Buy $Blocks</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {!isVerySmallScreen && <TimeMenu />}
                                {!isWrapShow && <WrapButton />}
                            </>
                        )}
                        <ConnectButton />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
