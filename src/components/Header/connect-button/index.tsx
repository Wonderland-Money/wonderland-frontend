import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../../hooks";
import { DEFAULT_NETWORK } from "../../../constants";
import { IReduxState } from "../../../store/slices/state.interface";
import { IPendingTxn } from "../../../store/slices/pending-txns-slice";
import { Link, SvgIcon } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../../assets/icons/x.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import "./connect-menu.scss";
import CircularProgress from "@material-ui/core/CircularProgress";

function ConnectMenu() {
    const { connect, disconnect, connected, web3, providerChainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();
    const address = useAddress();
    const [isConnected, setConnected] = useState(connected);

    let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    let buttonText = "Connect Wallet";
    let clickFunc: any = connect;
    let buttonStyle = {};

    if (isConnected) {
        buttonText = "";
        clickFunc = disconnect;
        buttonStyle = { borderRadiusTopLeft: 0, borderRadiusBottomLeft: 0 };
    }

    if (pendingTransactions && pendingTransactions.length > 0) {
        buttonText = `${pendingTransactions.length} Pending `;
        buttonStyle = { backgroundColor: "#000000" };
        clickFunc = () => {};
    }

    if (isConnected && providerChainID !== DEFAULT_NETWORK) {
        buttonText = "Please Connect to Harmony";
        buttonStyle = { backgroundColor: "rgb(255, 67, 67)" };
        clickFunc = () => {
            checkWrongNetwork();
        };
    }

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <div className="connect-section">
            {address && (
                <div className="wallet-link">
                    <Link href={`https://explorer.harmony.one/address/${address}`} target="_blank">
                        <p>{shorten(address)}</p>
                    </Link>
                </div>
            )}
            <div className="connect-button" style={buttonStyle} onClick={clickFunc}>
                {isConnected && pendingTransactions.length == 0 && providerChainID == DEFAULT_NETWORK && <SvgIcon color="primary" component={XIcon} />}
                <p>{buttonText}</p>
                {pendingTransactions.length > 0 && (
                    <div className="connect-button-progress">
                        <CircularProgress size={15} color="inherit" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConnectMenu;
