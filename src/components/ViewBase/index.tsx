import React, { useState } from "react";
import "./view-base.scss";
import Header from "../Header";
import { Hidden, makeStyles, useMediaQuery } from "@material-ui/core";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import Social from "../Social";
import Messages from "../Messages";

interface IViewBaseProps {
    socialIsOpen: boolean;
    connectButtonIsOpen: boolean;
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
        marginLeft: 0,
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function ViewBase({ socialIsOpen, connectButtonIsOpen, children }: IViewBaseProps) {
    const classes = useStyles();

    const isSmallerScreen = useMediaQuery("(max-width: 960px)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");

    return (
        <div className="view-base-root">
            <div className="bg-mascot" />
            <Messages />
            {connectButtonIsOpen && <Header />}
            <div className={classes.drawer}>
                <Social socialIsOpen={socialIsOpen} />
            </div>
            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>{children}</div>
        </div>
    );
}

export default ViewBase;
