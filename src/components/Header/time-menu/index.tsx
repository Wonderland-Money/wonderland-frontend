import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULD_NETWORK, WMEMO_TOKEN_DECIMALS } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./time-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { getTokenUrl } from "../../../helpers";

const WMEMO_SYMBOL = "wMEMO";

const tokenSymbolToDecimals = (tokenSymbol: string) => {
    return tokenSymbol === WMEMO_SYMBOL ? WMEMO_TOKEN_DECIMALS : TOKEN_DECIMALS;
};

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
    const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());
    const tokenDecimals = tokenSymbolToDecimals(tokenSymbol);

    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage,
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

function TimeMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULD_NETWORK;
    });

    const addresses = getAddresses(networkID);

    const TIME_SYMBOL = "TIME";
    const MEMO_SYMBOL = "MEMO";

    const MEMO_ADDRESS = addresses.MEMO_ADDRESS;
    const WMEMO_ADDRESS = addresses.WMEMO_ADDRESS;
    const TIME_ADDRESS = addresses.TIME_ADDRESS;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="time-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="time-menu-btn">
                <p>TIME</p>
            </div>

            <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link className="tooltip-item" href={`https://www.traderjoexyz.com/#/trade?inputCurrency=&outputCurrency=${TIME_ADDRESS}`} target="_blank">
                                <p>Buy on Trader Joe</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <p className="add-tokens-title">ADD TOKEN TO WALLET</p>
                                    <div className="divider" />
                                    <div className="tooltip-item" onClick={addTokenToWallet(TIME_SYMBOL, TIME_ADDRESS)}>
                                        <p>TIME</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet(MEMO_SYMBOL, MEMO_ADDRESS)}>
                                        <p>MEMO</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet(WMEMO_SYMBOL, WMEMO_ADDRESS)}>
                                        <p>wMEMO</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default TimeMenu;
