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
import { IPresaleSlice, getPresaleDetails, changeApproval, buyPresale, claimPresale } from "../../store/slices/presale-slice";
import { trim } from "../../helpers";

function Presale() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const presale = useSelector<IReduxState, IPresaleSlice>(state => state.presale);

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const presaleAddress = useSelector<IReduxState, string>(state => {
        return state.presale.approvedContractAddress;
    });
    const buyable = useSelector<IReduxState, string>(state => {
        return state.presale.amountBuyable;
    });
    const psiPrice = useSelector<IReduxState, any>(state => {
        return state.presale.psiPrice;
    });
    const untilVestingStart = useSelector<IReduxState, string>(state => {
        return state.presale.vestingStart;
    });
    const vestingPeriod = useSelector<IReduxState, string>(state => {
        return state.presale.vestingTerm;
    });
    const allowance = useSelector<IReduxState, number>(state => {
        return state.presale.allowanceVal;
    });
    const claimablePsi = useSelector<IReduxState, number>(state => {
        return state.presale.claimablePsi;
    });
    const claimedPsi = useSelector<IReduxState, number>(state => {
        return state.presale.claimedPsi;
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
        dispatch(getPresaleDetails({ provider, networkID: chainID, address }))
    };

    const onBuyPresale = async () => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: messages.before_minting }));
        } else {
            await dispatch(buyPresale({ value: String(quantity), presaleAddress, provider }));
            setQuantity("");
            dispatch(getPresaleDetails({ provider, networkID: chainID, address }))
        }
    };

    const onClaimPresale = async (stake: boolean) => {
        if (await checkWrongNetwork()) return;
        await dispatch(claimPresale({ address, presaleAddress, networkID: chainID, provider, stake }));
        setQuantity("");
        dispatch(getPresaleDetails({ provider, networkID: chainID, address }))
    };

    const hasAllowance = useCallback(() => {
        return allowance > 0;
    }, [allowance]);

    const isAllowed = useCallback(() => {
        return presale.approvedContractAddress != "";
    }, [presale.approvedContractAddress]);

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    return (
        <div className="presale-view">
            <Zoom in={true}>
                <div className="presale-card">
                    <Grid className="presale-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="presale-card-header">
                                <p className="presale-card-header-title">Presale</p>
                            </div>
                        </Grid>

                        <div className="presale-card-area">
                            {!address && (
                                <div className="presale-card-wallet-notification">
                                    <div className="presale-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="presale-card-wallet-desc-text">Connect your wallet to stake PSI tokens!</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="presale-card-action-area">
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
                                            />)}

                                            {view === 0 && (
                                                <div className="presale-card-tab-panel"> 
                                                    {address && !isAllowed() ? (
                                                        <div className="presale-card-tab-panel-non">
                                                            <p>Not Eligible for Presale</p>
                                                        </div>
                                                    ) : (
                                                    address && hasAllowance() ? (
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
                                                    ))}
                                                </div>
                                            )}

                                            {view === 1 && (
                                                <div className="presale-card-tab-panel">
                                                    {address && !isAllowed() ? (
                                                        <div className="presale-card-tab-panel-non">
                                                            <p>Not Eligible for Presale</p>
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

                                    
                                    </div>
                                    {view === 0 && (
                                        <div className="presale-user-data">
                                            <div className="data-row">
                                                <p className="data-row-name">Amount of PSI You Will Recieve</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{trim(Number(quantity)/(Number(psiPrice)/Math.pow(10,18)),2)} PSI</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Max Amount Payable</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>${trim(Number(buyable),2)} FRAX</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Max Amount Buyable</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{trim(Number(buyable)/(Number(psiPrice)/Math.pow(10,18)),2)} PSI</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Price per PSI</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>${Number(psiPrice)/Math.pow(10,18)} FRAX</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Time Until Vesting Starts</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{untilVestingStart}</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Vesting Term</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{vestingPeriod}</>}</p>
                                            </div>
                                        </div>)}
                                    {view === 1 && (
                                        <div className="presale-user-data">
                                            <div className="data-row">
                                                <p className="data-row-name">Claimable PSI</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{trim(claimablePsi, 2)} PSI</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Claimed PSI</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{trim(claimedPsi, 2)} PSI</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Time Until Vesting Starts</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{untilVestingStart}</>}</p>
                                            </div>

                                            <div className="data-row">
                                                <p className="data-row-name">Vesting Term</p>
                                                <p className="data-row-value">{isAppLoading || presaleAddress=="" ? <Skeleton width="80px" /> : <>{vestingPeriod}</>}</p>
                                            </div>
                                        </div>
                                    )}
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
