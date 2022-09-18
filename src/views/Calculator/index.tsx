import React, { useEffect, useMemo, useState } from "react";
import "./calculator.scss";
import { useSelector } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from "@material-ui/core";
import { IReduxState } from "../../store/slices/state.interface";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { usePathForNetwork, useWeb3Context } from "../../hooks";

function Calculator() {
    const history = useHistory();
    const { chainID } = useWeb3Context();

    usePathForNetwork({ pathName: "calculator", networkID: chainID, history });

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const wMemoMarketPrice = useSelector<IReduxState, number>(state => {
        return state.app.wMemoMarketPrice;
    });
    const timeMarketPrice = useSelector<IReduxState, number>(state => {
        return state.app.marketPrice;
    });
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const wMemoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wmemo;
    });
    const wrapPrice = useSelector<IReduxState, number>(state => {
        return state.wrapping.prices && state.wrapping.prices.wmemoMemo;
    });

    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    const trimmedWMemoBalance = trim(Number(wMemoBalance), 6);
    const trimeMarketPrice = trim(wMemoMarketPrice, 2);
    const trimeTimePrice = trim(timeMarketPrice, 2);

    const [wmemoAmount, setWMemoAmount] = useState(trimmedWMemoBalance);
    const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
    const [days, setDays] = useState(30);

    const [potentialReturn, setPotentialReturn] = useState("0");

    const currentWealth = useMemo(() => {
        const wmemo = Number(wmemoAmount) || 0;
        const price = parseFloat(trimeMarketPrice);
        const amount = wmemo * price;
        return trim(amount, 2);
    }, [wmemoAmount]);

    const calcNewBalance = () => {
        let value = parseFloat(rewardYield) / 100;
        value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
        let balance = Number(wmemoAmount);
        balance = balance * wrapPrice;
        for (let i = 0; i < days * 3; i++) {
            balance += balance * value;
        }
        return balance;
    };

    useEffect(() => {
        const newBalance = calcNewBalance();
        const newPotentialReturn = newBalance * (parseFloat(trimeTimePrice) || 0);
        setPotentialReturn(trim(newPotentialReturn, 2));
    }, [days, rewardYield, wmemoAmount]);

    return (
        <div className="calculator-view">
            <Zoom in={true}>
                <div className="calculator-card">
                    <Grid className="calculator-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="calculator-card-header">
                                <p className="calculator-card-header-title">Calculator</p>
                                <p className="calculator-card-header-subtitle">Estimate your returns</p>
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="calculator-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="calculator-card-apy">
                                            <p className="calculator-card-metrics-title">wMEMO Price</p>
                                            <p className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trimeMarketPrice}`}</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="calculator-card-tvl">
                                            <p className="calculator-card-metrics-title">Current APY</p>
                                            <p className="calculator-card-metrics-value">
                                                {isAppLoading ? <Skeleton width="100px" /> : <>{new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%</>}
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="calculator-card-index">
                                            <p className="calculator-card-metrics-title">Your wMEMO Balance</p>
                                            <p className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : <>{trimmedWMemoBalance} wMEMO</>}</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="calculator-card-area">
                            <div>
                                <div className="calculator-card-action-area">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">wMEMO Amount</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={wmemoAmount}
                                                    onChange={e => setWMemoAmount(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setWMemoAmount(trimmedWMemoBalance)} className="stake-card-action-input-btn">
                                                                <p>Max</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">APY (%)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={rewardYield}
                                                    onChange={e => setRewardYield(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setRewardYield(trimmedStakingAPY)} className="stake-card-action-input-btn">
                                                                <p>Current</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="calculator-days-slider-wrap">
                                    <p className="calculator-days-slider-wrap-title">{`${days} day${days > 1 ? "s" : ""}`}</p>
                                    <Slider className="calculator-days-slider" min={1} max={365} value={days} onChange={(e, newValue: any) => setDays(newValue)} />
                                </div>
                                <div className="calculator-user-data">
                                    <div className="data-row">
                                        <p className="data-row-name">Current wealth</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${currentWealth}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential wealth</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential number of lambos</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{Math.floor(Number(potentialReturn) / 220000)}</>}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Calculator;
