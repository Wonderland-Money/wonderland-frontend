import React, { useState } from "react";
import "./view-base.scss";
import Header from "../Header";
import { Hidden, makeStyles, useMediaQuery } from "@material-ui/core";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import MobileDrawer from "../Drawer/mobile-drawer";
import Drawer from "../Drawer";
import { cubesImage } from "src/constants/img";
import Messages from "../Messages";

interface IViewBaseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    content: {
        padding: theme.spacing(1),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        height: "100%",
        overflow: "auto",
        marginLeft: DRAWER_WIDTH,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function ViewBase({ children }: IViewBaseProps) {
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);

    const isSmallerScreen = useMediaQuery("(max-width: 960px)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className="view-base-root">
            <Messages />
            <Header drawe={!isSmallerScreen} handleDrawerToggle={handleDrawerToggle} />
            <div className={classes.drawer}>
                <Hidden mdUp>
                    <MobileDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                </Hidden>
                <Hidden smDown>
                    <Drawer />
                </Hidden>
            </div>
            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
                {!isSmallerScreen && (
                    <div className="cubes-top">
                        <p>{cubesImage}</p>
                    </div>
                )}
                {!isSmallScreen && (
                    <div className="cubes-bottom">
                        <p>{cubesImage}</p>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export default ViewBase;
