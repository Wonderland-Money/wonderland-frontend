import React from "react";
import "./footer.scss";
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import { IReduxState } from "../../../../store/slices/state.interface";
import { trim } from "../../../../helpers";
import { Skeleton } from "@material-ui/lab";

function Footer() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const treasuryBalance = useSelector<IReduxState, number>(state => {
        return state.app.treasuryBalance;
    });
    const circSupply = useSelector<IReduxState, number>(state => {
        return state.app.circSupply;
    });

    const trimmedStakingAPY = trim(stakingAPY * 100, 1);

    return (
        <div className="landing-footer">
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">Total Staked</p>
                        <p className="landing-footer-item-value">
                            {isAppLoading ? (
                                <Skeleton width="180px" />
                            ) : (
                                new Intl.NumberFormat("en-US", {
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                }).format(circSupply)
                            )}
                        </p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">Treasury Balance</p>
                        <p className="landing-footer-item-value">
                            {isAppLoading ? (
                                <Skeleton width="180px" />
                            ) : (
                                new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                }).format(treasuryBalance)
                            )}
                        </p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">Current APY</p>
                        <p className="landing-footer-item-value">
                            {stakingAPY ? <>{new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%</> : <Skeleton width="150px" />}
                        </p>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Footer;
