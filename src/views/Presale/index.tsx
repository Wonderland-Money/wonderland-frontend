import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import "./presale.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import { IPresaleOneSlice, getPresaleOneDetails, changeApproval, buyPresaleOne, claimPresaleOne } from "../../store/slices/presale-one-slice";
import { IPresaleTwoSlice, getPresaleTwoDetails, buyPresaleTwo, claimPresaleTwo } from "../../store/slices/presale-two-slice";
import { IPresaleThreeSlice, getPresaleThreeDetails, buyPresaleThree, claimPresaleThree } from "../../store/slices/presale-three-slice";
import { IPresaleFourSlice, getPresaleFourDetails, buyPresaleFour, claimPresaleFour } from "../../store/slices/presale-four-slice";
import { trim } from "../../helpers";

import { IconButton, SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

import classNames from "classnames";

/*
 *   PresaleOne: WL Round
 *   PresaleTwo: Discord Round
 *   PresaleThree: Open Round 1
 *   PresaleFour: Open Round 2 (Uncomment this one once Open Round 1 is complete)
 */

function Presale(props: any) {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const presaleOne = useSelector<IReduxState, IPresaleOneSlice>(state => state.presaleOne);
    const presaleTwo = useSelector<IReduxState, IPresaleTwoSlice>(state => state.presaleTwo);
    const presaleThree = useSelector<IReduxState, IPresaleThreeSlice>(state => state.presaleThree);

    const [view, setView] = useState(0);
    const [phase, setPhase] = useState(1);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const presaleAddress = useSelector<IReduxState, string>(state => {
        let approvedAddress;
        if (phase == 1) {
            approvedAddress = state.presaleOne.approvedContractAddress;
        } else if (phase == 2) {
            approvedAddress = state.presaleTwo.approvedContractAddress;
        } else if (phase == 3) {
            approvedAddress = state.presaleThree.approvedContractAddress;
        } else {
            approvedAddress = state.presaleFour.approvedContractAddress;
        }
        return approvedAddress;
    });
    const buyable = useSelector<IReduxState, string>(state => {
        let amountBuyable;
        if (phase == 1) {
            amountBuyable = state.presaleOne.amountBuyable;
        } else if (phase == 2) {
            amountBuyable = state.presaleTwo.amountBuyable;
        } else if (phase == 3) {
            amountBuyable = state.presaleThree.amountBuyable;
        } else {
            amountBuyable = state.presaleFour.amountBuyable;
        }
        return amountBuyable;
    });
    const psiPrice = useSelector<IReduxState, any>(state => {
        let psiPrice;
        if (phase == 1) {
            psiPrice = state.presaleOne.psiPrice;
        } else if (phase == 2) {
            psiPrice = state.presaleTwo.psiPrice;
        } else if (phase == 3) {
            psiPrice = state.presaleThree.psiPrice;
        } else {
            psiPrice = state.presaleFour.psiPrice;
        }
        return psiPrice;
    });
    const untilVestingStart = useSelector<IReduxState, string>(state => {
        let vestingStart;
        if (phase == 1) {
            vestingStart = state.presaleOne.vestingStart;
        } else if (phase == 2) {
            vestingStart = state.presaleTwo.vestingStart;
        } else if (phase == 3) {
            vestingStart = state.presaleThree.vestingStart;
        } else {
            vestingStart = state.presaleFour.vestingStart;
        }
        return vestingStart;
    });
    const vestingPeriod = useSelector<IReduxState, string>(state => {
        let vestingTerm;
        if (phase == 1) {
            vestingTerm = state.presaleOne.vestingTerm;
        } else if (phase == 2) {
            vestingTerm = state.presaleTwo.vestingTerm;
        } else if (phase == 3) {
            vestingTerm = state.presaleThree.vestingTerm;
        } else {
            vestingTerm = state.presaleFour.vestingTerm;
        }
        return vestingTerm;
    });
    const allowance = useSelector<IReduxState, number>(state => {
        let allowanceVal;
        if (phase == 1) {
            allowanceVal = state.presaleOne.allowanceVal;
        } else if (phase == 2) {
            allowanceVal = state.presaleTwo.allowanceVal;
        } else if (phase == 3) {
            allowanceVal = state.presaleThree.allowanceVal;
        } else {
            allowanceVal = state.presaleFour.allowanceVal;
        }
        return allowanceVal;
    });
    const claimablePsi = useSelector<IReduxState, number>(state => {
        let claimablePsi;
        if (phase == 1) {
            claimablePsi = state.presaleOne.claimablePsi;
        } else if (phase == 2) {
            claimablePsi = state.presaleTwo.claimablePsi;
        } else if (phase == 3) {
            claimablePsi = state.presaleThree.claimablePsi;
        } else {
            claimablePsi = state.presaleThree.claimablePsi;
        }
        return claimablePsi;
    });
    const claimedPsi = useSelector<IReduxState, number>(state => {
        let claimedPsi;
        if (phase == 1) {
            claimedPsi = state.presaleOne.claimedPsi;
        } else if (phase == 2) {
            claimedPsi = state.presaleTwo.claimedPsi;
        } else if (phase == 3) {
            claimedPsi = state.presaleThree.claimedPsi;
        } else {
            claimedPsi = state.presaleThree.claimedPsi;
        }
        return claimedPsi;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        if (view === 0) {
            setQuantity(buyable);
        } else {
            setQuantity("0");
        }
    };

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;
        await dispatch(changeApproval({ provider, networkID: chainID, presaleAddress, address }));
        dispatch(getPresaleOneDetails({ provider, networkID: chainID, address }));
        dispatch(getPresaleTwoDetails({ provider, networkID: chainID, address }));
        dispatch(getPresaleThreeDetails({ provider, networkID: chainID, address }));
        /*
         *  Uncomment this once Open Round 2 starts:
         */
        // dispatch(getPresaleFourDetails({ provider, networkID: chainID, address }));
    };

    const onBuyPresale = async () => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: messages.before_minting }));
        } else {
            if (phase == 1) {
                await dispatch(buyPresaleOne({ value: String(quantity), presaleAddress, provider }));
                dispatch(getPresaleOneDetails({ provider, networkID: chainID, address }));
            } else if (phase == 2) {
                await dispatch(buyPresaleTwo({ value: String(quantity), presaleAddress, provider }));
                dispatch(getPresaleTwoDetails({ provider, networkID: chainID, address }));
            } else if (phase == 3) {
                await dispatch(buyPresaleThree({ value: String(quantity), presaleAddress, provider }));
                dispatch(getPresaleThreeDetails({ provider, networkID: chainID, address }));
            } else {
                await dispatch(buyPresaleFour({ value: String(quantity), presaleAddress, provider }));
                dispatch(getPresaleFourDetails({ provider, networkID: chainID, address }));
            }
            setQuantity("");
        }
    };

    const onClaimPresale = async (stake: boolean) => {
        if (await checkWrongNetwork()) return;
        if (phase == 1) {
            await dispatch(claimPresaleOne({ address, presaleAddress, networkID: chainID, provider, stake }));
            dispatch(getPresaleOneDetails({ provider, networkID: chainID, address }));
        } else if (phase == 2) {
            await dispatch(claimPresaleTwo({ address, presaleAddress, networkID: chainID, provider, stake }));
            dispatch(getPresaleTwoDetails({ provider, networkID: chainID, address }));
        } else if (phase == 4) {
            await dispatch(claimPresaleThree({ address, presaleAddress, networkID: chainID, provider, stake }));
            dispatch(getPresaleThreeDetails({ provider, networkID: chainID, address }));
        } else {
            await dispatch(claimPresaleFour({ address, presaleAddress, networkID: chainID, provider, stake }));
            dispatch(getPresaleFourDetails({ provider, networkID: chainID, address }));
        }
        setQuantity("");
    };

    const hasAllowance = useCallback(() => {
        return allowance > 0;
    }, [allowance]);

    const isAllowed = useSelector<IReduxState, boolean>(state => {
        let allowed;
        if (phase == 1) {
            allowed = state.presaleOne.approvedContractAddress != "";
        } else if (phase == 2) {
            allowed = state.presaleTwo.approvedContractAddress != "";
        } else if (phase == 3) {
            allowed = true;
        } else {
            allowed = true;
        }
        return allowed;
    });

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    const changePhase = (newPhase: number) => () => {
        changeView(0);
        setPhase(newPhase);
        setQuantity("");
    };

    return (
        <div className={classNames("presale-view", { disabled: !props.active })}>
            <Zoom in={true}>
                <div className="presale-card">
                    <Grid className="presale-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="presale-card-header">
                                <a
                                    onClick={() => {
                                        window.parent.postMessage("closeMenu", window.location.origin);
                                        window.parent.postMessage("closePresale", window.location.origin);
                                    }}
                                    className="close-app-btn"
                                >
                                    <SvgIcon color="primary" component={XIcon} />
                                </a>
                                <p className="presale-card-header-title">Presale</p>
                            </div>
                        </Grid>

                        <div className="presale-card-area">
                            {!address && (
                                <div className="presale-card-wallet-notification">
                                    <div className="presale-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="presale-card-wallet-desc-text">Connect your wallet to buy presale PSI tokens!</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="presale-card-action-area">
                                        <div className="presale-card-action-stage-btns-wrap">
                                            <div onClick={changePhase(1)} className={classnames("presale-phase-btn", { active: phase == 1 })}>
                                                <p>WL</p>
                                            </div>
                                            <div onClick={changePhase(2)} className={classnames("presale-phase-btn", { active: phase == 2 })}>
                                                <p>Discord</p>
                                            </div>
                                            <div onClick={changePhase(3)} className={classnames("presale-phase-btn", { active: phase == 3 })}>
                                                <p>Open Round 1</p>
                                            </div>
                                            {
                                                /*
                                                 *  Uncomment the following once open round one is bought out
                                                 *  (Also remove curly brackets)
                                                 */
                                                // <div onClick={changePhase(4)} className={classnames("presale-card-action-stage-btn", { active: phase==4 })}>
                                                //     <p>Open Round 2</p>
                                                // </div>
                                            }
                                        </div>
                                        <div className="presale-content-card">
                                            <div className="presale-card-action-stage-btns-wrap">
                                                <div onClick={changeView(0)} className={classnames("presale-card-action-stage-btn", { active: !view })}>
                                                    <p>Purchase</p>
                                                </div>
                                                <div onClick={changeView(1)} className={classnames("presale-card-action-stage-btn", { active: view })}>
                                                    <p>Claim</p>
                                                </div>
                                            </div>

                                            <div className="presale-card-action-row">
                                                {view === 0 && (
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount of FRAX"
                                                        className="presale-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <div onClick={setMax} className="presale-card-action-input-btn">
                                                                    <p>Max</p>
                                                                </div>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                )}

                                                {view === 0 && (
                                                    <div className="presale-card-tab-panel">
                                                        {address && !isAllowed ? (
                                                            <div className="presale-card-tab-panel-non">
                                                                <p>Not Eligible</p>
                                                            </div>
                                                        ) : address && hasAllowance() ? (
                                                            <div
                                                                className="presale-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "presale")) return;
                                                                    onBuyPresale();
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "presale", "Buy PSI")}</p>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="presale-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "approving")) return;
                                                                    onSeekApproval();
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "approving", "Approve")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {view === 1 && (
                                                    <div className="presale-card-tab-panel">
                                                        {address && !isAllowed ? (
                                                            <div className="presale-card-tab-panel-non">
                                                                <p>Not Eligible</p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div
                                                                    className="presale-card-tab-panel-btn"
                                                                    onClick={() => {
                                                                        if (isPendingTxn(pendingTransactions, "claiming")) return;
                                                                        onClaimPresale(false);
                                                                    }}
                                                                >
                                                                    <p>{txnButtonText(pendingTransactions, "claiming", "Claim PSI")}</p>
                                                                </div>
                                                                <div
                                                                    className="presale-card-tab-panel-btn"
                                                                    onClick={() => {
                                                                        if (isPendingTxn(pendingTransactions, "claiming")) return;
                                                                        onClaimPresale(true);
                                                                    }}
                                                                >
                                                                    <p>{txnButtonText(pendingTransactions, "claiming", "Claim and Autostake")}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {view === 0 && (
                                                <div className="presale-user-data">
                                                    <div className="data-row">
                                                        <p className="data-row-name">Amount of PSI You Will Recieve</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? (
                                                                <Skeleton width="80px" />
                                                            ) : (
                                                                <>{trim(Number(quantity) / (Number(psiPrice) / Math.pow(10, 18)), 2)} PSI</>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Max Amount Payable</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>${trim(Number(buyable), 2)} FRAX</>}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Max Amount Buyable</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? (
                                                                <Skeleton width="80px" />
                                                            ) : (
                                                                <>{trim(Number(buyable) / (Number(psiPrice) / Math.pow(10, 18)), 2)} PSI</>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Price per PSI</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>${Number(psiPrice) / Math.pow(10, 18)} FRAX</>}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Time Until Vesting Starts</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>{untilVestingStart}</>}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Vesting Term</p>
                                                        <p className="data-row-value">{isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>{vestingPeriod}</>}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {view === 1 && (
                                                <div className="presale-user-data">
                                                    <div className="data-row">
                                                        <p className="data-row-name">Claimable PSI</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>{trim(claimablePsi, 2)} PSI</>}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Claimed PSI</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>{trim(claimedPsi, 2)} PSI</>}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Time Until Vesting Starts</p>
                                                        <p className="data-row-value">
                                                            {isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>{untilVestingStart}</>}
                                                        </p>
                                                    </div>

                                                    <div className="data-row">
                                                        <p className="data-row-name">Vesting Term</p>
                                                        <p className="data-row-value">{isAppLoading || presaleAddress == "" ? <Skeleton width="80px" /> : <>{vestingPeriod}</>}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Presale;
