import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { prettifySeconds, trim } from "src/helpers";
import { usePathForNetwork, useWeb3Context } from "src/hooks";
import { IReduxState } from "src/store/slices/state.interface";
import "./redemption.scss";
import wMemoIcon from "../../assets/tokens/MEMO.png";
import UsdcIcon from "../../assets/tokens/USDC.e.png";
import BsggIcon from "../../assets/tokens/BSGG.png";
import BridgeIcon from "../../assets/icons/bridge.svg";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { Networks } from "src/constants";
import { changeApproval, changeSwap } from "src/store/slices/redemption-thunk";
import { BigNumber, ethers } from "ethers";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "src/constants/messages";
import moment from "moment";
import VotesList from "../../constants/jsons/votes.json";

function Redemption() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { chainID, address, connect, checkWrongNetwork, provider } = useWeb3Context();

    usePathForNetwork({ pathName: "redemption", networkID: chainID, history });

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const wmemoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wmemo;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const wMemoAllowance = useSelector<IReduxState, number>(state => {
        return state.account.redemption && state.account.redemption.wmemo;
    });

    const availableToClaim = useSelector<IReduxState, string>(state => {
        return state.account.redemptionClaim && state.account.redemptionClaim.avalable;
    });

    const redemptionRateUsdc = useSelector<IReduxState, number>(state => {
        return state.app && state.app.redemptionRateUsdc;
    });
    const redemptionRateBsgg = useSelector<IReduxState, number>(state => {
        return state.app && state.app.redemptionRateBsgg;
    });

    const redemptionDeadline = useSelector<IReduxState, number>(state => {
        return state.app && state.app.redemptionDeadline;
    });

    const hasAllowance = useCallback(() => (chainID === Networks.AVAX ? wMemoAllowance > 0 : true), [wMemoAllowance, chainID]);

    const trimmedWmemoBalance = trim(Number(wmemoBalance), 6);
    const trimmedAvailableToClaim = trim(Number(availableToClaim), 6);

    const [quantity, setQuantity] = useState<string>("");
    const [usdcConvert, setUsdcConvert] = useState<string>("");
    const [bsggConvert, setBsggConvert] = useState<string>("");

    const handleSetQuantity = (amount: string) => {
        setQuantity(amount);
        if (!amount) {
            setUsdcConvert("");
            setBsggConvert("");
            return;
        }
        const usdc = BigNumber.from(ethers.utils.parseEther(amount))
            .mul(BigNumber.from(redemptionRateUsdc).mul(Math.pow(10, 12)))
            .div(ethers.utils.parseEther("1"));
        const bsgg = BigNumber.from(ethers.utils.parseEther(amount)).mul(BigNumber.from(redemptionRateBsgg)).div(ethers.utils.parseEther("1"));

        setUsdcConvert(ethers.utils.formatEther(usdc));
        setBsggConvert(ethers.utils.formatEther(bsgg));
    };

    const setMax = () => {
        const amount = Number(availableToClaim) > Number(wmemoBalance) ? wmemoBalance : availableToClaim;
        handleSetQuantity(amount);
    };

    const onRedeem = async () => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: messages.before_redemption }));
        } else {
            await dispatch(changeSwap({ provider, networkID: chainID, value: quantity, address }));
            setQuantity("");
            setUsdcConvert("");
            setBsggConvert("");
        }
    };

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, provider, networkID: chainID }));
    };

    const deadline = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        if (!redemptionDeadline) return <Skeleton width="80px" />;
        if (redemptionDeadline - now > 0) return prettifySeconds(redemptionDeadline - now);
        return moment(redemptionDeadline).format("MM.DD.YYYY");
    }, [redemptionDeadline]);

    const inList = useMemo(() => !!VotesList.find(({ voter }) => voter.toLocaleLowerCase() === address.toLocaleLowerCase()), [address]);

    return (
        <div className="redemption-view">
            <Zoom in={true}>
                <div className="redemption-card">
                    <Grid className="redemption-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="redemption-card-header">
                                <p className="redemption-card-header-title">Redemption</p>
                            </div>
                        </Grid>

                        <div className="redemption-card-area">
                            {!address && (
                                <div className="redemption-card-wallet-notification">
                                    <div className="redemption-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="redemption-card-wallet-desc-text">Connect your wallet for redeem wMEMO tokens!</p>
                                </div>
                            )}
                            {address && (
                                <>
                                    <div className="redemption-body-wrap">
                                        <div className="redemption-input-wrap">
                                            <p className="redemption-input-wrap-title">From token</p>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="redemption-input"
                                                value={quantity}
                                                onChange={e => handleSetQuantity(e.target.value)}
                                                labelWidth={0}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <div className="redemption-input-token-wrap">
                                                            <img className="redemption-input-token-wrap-logo" src={wMemoIcon} alt="" />
                                                            <p>wMEMO</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="redemption-input-btn">
                                                            <p>Max</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />
                                        </div>
                                        <div className="redemption-arrows">
                                            <img alt="" src={BridgeIcon} />
                                        </div>
                                        <div className="redemption-input-wrap">
                                            <p className="redemption-input-wrap-title">To token</p>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="redemption-input"
                                                value={usdcConvert}
                                                labelWidth={0}
                                                disabled
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <div className="redemption-input-token-wrap">
                                                            <img className="redemption-input-token-wrap-logo" src={UsdcIcon} alt="" />
                                                            <p>USDC</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />
                                        </div>
                                        <div className="redemption-input-wrap" style={{ marginTop: 10 }}>
                                            <p className="redemption-input-wrap-title">To token</p>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="redemption-input"
                                                value={bsggConvert}
                                                labelWidth={0}
                                                disabled
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <div className="redemption-input-token-wrap">
                                                            <img className="redemption-input-token-wrap-logo" src={BsggIcon} alt="" />
                                                            <p>BSGG</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />
                                        </div>
                                        {hasAllowance() ? (
                                            <div
                                                className="redemption-swap-button"
                                                onClick={() => {
                                                    if (isPendingTxn(pendingTransactions, "redemption")) return;
                                                    onRedeem();
                                                }}
                                            >
                                                <p>{txnButtonText(pendingTransactions, "redemption", "Swap")}</p>
                                            </div>
                                        ) : (
                                            <div
                                                className="redemption-swap-button"
                                                onClick={() => {
                                                    if (isPendingTxn(pendingTransactions, "approve_redemption")) return;
                                                    onSeekApproval();
                                                }}
                                            >
                                                <p>{txnButtonText(pendingTransactions, "approve_redemption", "Approve")}</p>
                                            </div>
                                        )}

                                        <div className="help-text">
                                            <p>Note: This action is one way only, once you redeem your USDC + BSGG you can not go back to wMEMO</p>
                                        </div>
                                    </div>
                                    <div className="redemption-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">Your Wallet Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedWmemoBalance} wMEMO</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Maximum Claimable Amount</p>
                                            <p className="data-row-value">
                                                {isAppLoading ? <Skeleton width="80px" /> : inList ? <>{trimmedAvailableToClaim} wMEMO</> : "Address not eligible for redemption"}
                                            </p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Rate</p>
                                            <p className="data-row-value">
                                                {isAppLoading ? (
                                                    <Skeleton width="80px" />
                                                ) : (
                                                    <div style={{ display: "flex" }}>
                                                        <p style={{ margin: "auto" }}>1 wMEMO = </p>
                                                        <div style={{ marginLeft: 5 }}>
                                                            <p>{ethers.utils.formatUnits(redemptionRateUsdc, "mwei")} USDC</p>
                                                            <p>{ethers.utils.formatEther(redemptionRateBsgg)} BSGG</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Deadline</p>
                                            <p className="data-row-value">{deadline}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Redemption;
