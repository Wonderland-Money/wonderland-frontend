import React, { useCallback, useMemo, useState } from "react";
import "./bridge.scss";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import { useWeb3Context } from "../../hooks";
import { useSelector, useDispatch } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { Skeleton } from "@material-ui/lab";
import { trim } from "../../helpers";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import wMemoIcon from "../../assets/tokens/MEMO.png";
import { Networks } from "../../constants/blockchain";
import { getChainList } from "../../helpers/get-chains";
import SelectNetwork from "./components/SelectNetwork";
import BridgeIcon from "../../assets/icons/bridge.svg";
import { warning } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { bridgeSwap, changeApproval } from "../../store/slices/bridge-thunk";

function Bridge() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork, switchNetwork } = useWeb3Context();

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const wMemoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wmemo;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const wMemoAllowance = useSelector<IReduxState, number>(state => {
        return state.account.bridge && state.account.bridge.wmemo;
    });

    const hasAllowance = useCallback(() => (chainID === Networks.AVAX ? wMemoAllowance > 0 : true), [wMemoAllowance, chainID]);

    const defaultToChain = useMemo(() => Number(getChainList(chainID)[0].chainId), [chainID]);

    const [quantity, setQuantity] = useState<string>("");
    const [toChain, setToChain] = useState<Networks>(defaultToChain);

    const setMax = () => setQuantity(wMemoBalance);

    const onBridge = async () => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: messages.before_bridge }));
        } else if (parseFloat(quantity) < 0.00063) {
            dispatch(warning({ text: messages.min_bridge_amount }));
        } else {
            await dispatch(bridgeSwap({ provider, networkID: chainID, value: quantity, address, toChain }));
            setQuantity("");
        }
    };

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, provider, networkID: chainID }));
    };

    const onNetworkSwap = (network?: Networks) => switchNetwork(network || toChain);

    const calcExpected = () => {
        let amount = 0;

        if (quantity && parseFloat(quantity) > 0) {
            amount = Number(quantity) - 0.00056;
        }

        return trim(amount, 6);
    };

    return (
        <div className="bridge-view">
            <Zoom in={true}>
                <div className="bridge-card">
                    <Grid className="bridge-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="bridge-card-header">
                                <p className="bridge-card-header-title">Bridge</p>
                                <p className="bridge-card-header-subtitle">Tokens to bridge</p>
                            </div>
                        </Grid>

                        <div className="bridge-card-area">
                            {!address && (
                                <div className="bridge-card-wallet-notification">
                                    <div className="bridge-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="bridge-card-wallet-desc-text">Connect your wallet to bridge wMEMO tokens!</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="bridge-card-select-networks-wrap">
                                        <SelectNetwork network={chainID} from handleSelect={onNetworkSwap} />
                                        <div onClick={() => onNetworkSwap()} className="bridge-card-select-networks-swap">
                                            <img alt="" src={BridgeIcon} />
                                        </div>
                                        <SelectNetwork network={toChain} handleSelect={setToChain} />
                                    </div>
                                    <div className="bridge-card-action-area">
                                        <div className="bridge-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="bridge-card-action-input"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                labelWidth={0}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <div className="bridge-card-action-input-token-wrap">
                                                            <img className="bridge-card-action-input-token-wrap-logo" src={wMemoIcon} alt="" />
                                                            <p>wMEMO</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="bridge-card-action-input-btn">
                                                            <p>Max</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />

                                            <div className="bridge-card-tab-panel">
                                                {hasAllowance() ? (
                                                    <div
                                                        className="bridge-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "bridging")) return;
                                                            onBridge();
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "bridging", "Bridge")}</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="bridge-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "approve_bridge")) return;
                                                            onSeekApproval();
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "approve_bridge", "Approve")}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!hasAllowance() && (
                                            <div className="bridge-help-text">
                                                <p>
                                                    Note: The "Approve" transaction is only needed when bridge for the first time; subsequent bridge only requires you to perform
                                                    the "Bridge"transaction.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bridge-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">Your Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(wMemoBalance), 6)} wMEMO</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Expected</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{calcExpected()} wMEMO</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Crosschain Fee</p>
                                            <p className="data-row-value">0.1 %</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Minimum Crosschain Fee</p>
                                            <p className="data-row-value">0.00056 wMEMO</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Maximum Crosschain Fee</p>
                                            <p className="data-row-value">0.015 wMEMO</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Minimum Crosschain Amount</p>
                                            <p className="data-row-value">0.00063 wMEMO</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Maximum Crosschain Amount</p>
                                            <p className="data-row-value">75 wMEMO</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Estimated Time of Crosschain Arrival</p>
                                            <p className="data-row-value">10-30 min</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Crosschain amount larger than 15 wMEMO could take up to</p>
                                            <p className="data-row-value">12 hours</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">Powered By</p>
                                            <p className="data-row-value">Anyswap</p>
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

export default Bridge;
