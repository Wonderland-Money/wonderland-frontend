import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Typography, Popper, Paper, Divider, Link } from "@material-ui/core";
import { useWeb3Context } from "../../hooks";
import { Networks, DEFAULD_NETWORK } from "../../constants";
import { IReduxState } from "../../store/slices/state.interface";
import { IPendingTxn } from "../../store/slices/pending-txns-slice";
import { ClickAwayListener } from "@material-ui/core";

function ConnectMenu() {
  const { connect, disconnect, connected, web3, chainID, providerChainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);

  let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  let buttonText = "Connect Wallet";
  let clickFunc: any = connect;
  let buttonStyle = {};

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  if (isConnected && providerChainID !== DEFAULD_NETWORK) {
    buttonText = "Wrong network";
    buttonStyle = { backgroundColor: "rgb(255, 67, 67)" };
    clickFunc = () => {
      alert("Please connect your wallet to Avalanche network to use Wonderland!");
    };
  }

  const open = Boolean(anchorEl);

  const getEtherscanUrl = (txnHash: string) => {
    return chainID === Networks.RINKEBY
      ? `https://rinkeby.etherscan.io/tx/${txnHash}`
      : `https://cchain.explorer.avax.network/tx/${txnHash}`;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <div className="wallet-menu" id="wallet-menu">
        <div className="connect-button" style={buttonStyle} onClick={clickFunc}>
          <p>{buttonText}</p>
        </div>

        <Popper className="pending-txn-root" open={open} anchorEl={anchorEl} placement="bottom">
          <Paper className="ohm-menu" elevation={1}>
            {pendingTransactions.map((x: any) => (
              <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} color="primary" target="_blank" rel="noreferrer">
                <div className="pending-txn-container">
                  <p>{x.text}</p>
                </div>
              </Link>
            ))}
            <Box className="add-tokens">
              <Divider color="secondary" />
              <div className="disconect-btn" onClick={disconnect}>
                <p>Disconnect</p>
              </div>
            </Box>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

export default ConnectMenu;
