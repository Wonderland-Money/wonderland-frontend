import { useLocation } from "react-router-dom";
import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "../../assets/icons/close.png";
import TimeMenu from "./time-menu";
import ConnectButton from "./connect-button";
import WrapButton from "./wrap-button";
import "./header.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import { useCallback, useEffect, useState } from "react";

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
    const [isShowBuy, setIsShowBuy] = useState<boolean>(false);
    useEffect(() => {
        if (location && location.pathname) setCurrentPath(location.pathname);
    }, [location]);
    const clickListener = useCallback(
        (e: MouseEvent) => {
            let currentId = e.srcElement && (e.srcElement! as any).id;
            if (isShowBuy && currentId !== "buyModal") setIsShowBuy(false);
        },
        [isShowBuy],
    );
    useEffect(() => {
        document.addEventListener("click", clickListener);
        return () => {
            document.removeEventListener("click", clickListener);
        };
    }, [clickListener]);
    return (
        <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
            <AppBar position="sticky" className={classes.appBar} elevation={0}>
                <Toolbar disableGutters className="dapp-topbar">
                    <div className="dapp-topbar-btns-wrap">
                        {currentPath === "/dash/dashboard" ? (
                            <div className="buy-menu-root" onClick={() => setIsShowBuy(true)}>
                                <div className="buy-menu-btn">
                                    <p>Buy $Blocks</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/*{!isVerySmallScreen && <TimeMenu />}*/}
                                {/*{!isWrapShow && <WrapButton />}*/}
                                <TimeMenu />
                                <WrapButton />
                            </>
                        )}
                        <ConnectButton />
                    </div>
                </Toolbar>
            </AppBar>
            {isShowBuy && (
                <div className="buy-popup-body">
                    <div id="buyModal" className="buy-popup-contents animate-zoom">
                        <div id="closeBuy" className="close-icon" onClick={() => setIsShowBuy(false)}>
                            <img src={CloseIcon} alt="close" />
                        </div>
                        <div className="item-txt">Buy on Sushiwap</div>
                        <div className="item-txt">Add SB to Metamask</div>
                        <div className="item-txt">Add xSB to Metamask</div>
                        <div className="item-txt">Add wxSB to Metamask</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
