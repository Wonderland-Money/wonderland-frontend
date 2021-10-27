import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./psi-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { getTokenUrl } from "../../../helpers";
import { Icon } from "@material-ui/core";

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
    const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: TOKEN_DECIMALS,
                        image: tokenImage,
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

function PsiMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULT_NETWORK;
    });

    const addresses = getAddresses(networkID);

    const SPSI_ADDRESS = addresses.SPSI_ADDRESS;
    const PSI_ADDRESS = addresses.PSI_ADDRESS;
    const SUSHI_SWAP_LINK = `https://app.sushi.com/swap?inputCurrency=&outputCurrency=${PSI_ADDRESS}`;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="psi-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="psi-menu-btn">
                <p>PSI</p>
            </div>

            <Popper className="psi-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link className="tooltip-item buy" href={SUSHI_SWAP_LINK} target="_blank">
                                <p>Buy on Sushi Swap</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <p className="add-tokens-title">Add token to wallet</p>
                                    {/* <div className="divider" /> */}
                                    <div className="tooltip-item" onClick={addTokenToWallet("PSI", PSI_ADDRESS)}>
                                        <p>PSI</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet("SPSI", SPSI_ADDRESS)}>
                                        <p>SPSI</p>
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

export default PsiMenu;
