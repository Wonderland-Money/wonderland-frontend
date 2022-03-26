import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./messageSign.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";

import { IconButton, SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

import { krakenSlayed } from "../../helpers/kraken-slayed";
import { useWeb3Context } from "src/hooks";

import classNames from "classnames";

function MessageSign(props: any) {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const { provider, address } = useWeb3Context();

    const messageSigned = () => {
        krakenSlayed(provider, address);
        window.parent.postMessage("closeMenu", window.location.origin);
        window.parent.postMessage("closeMessage", window.location.origin);
        window.parent.postMessage("signedMessage", window.location.origin);
    };

    return (
        <div className={classNames("message-view", { disabled: !props.active })}>
            <div className="message-infos-wrap">
                <div className="message-view-card-header">
                    <a
                        onClick={() => {
                            window.parent.postMessage("closeMenu", window.location.origin);
                            window.parent.postMessage("closeMessage", window.location.origin);
                        }}
                        className="close-app-btn"
                    >
                        <SvgIcon color="primary" component={XIcon} />
                    </a>
                    <p className="message-view-card-title">Confirm Account</p>
                </div>
                <div className="message-card">
                    <p>A Trident is earned, not given. With your newly found skills in combat, the gates of Atlantis are wide open for you. </p>
                    <p>Accept the call, and take responsibility in protecting the growing city of Atlantis.</p>
                    <p>Confirm your wallet address below to create an account. The services offered in The Harbor will then become available to you.</p>
                    {/* <div
                        className="message-sign-btn"
                        onClick={() => {
                            if (isPendingTxn(pendingTransactions, "presale")) return;
                            onBuyPresale();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "presale", "Buy PSI")}</p>
                    </div> */}
                    <div className="message-sign-btn" onClick={messageSigned}>
                        <p>Confirm</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageSign;
