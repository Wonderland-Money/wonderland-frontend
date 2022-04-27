import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./bridge-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { Icon } from "@material-ui/core";

function BridgeMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULT_NETWORK;
    });

    const addresses = getAddresses(networkID);

    const SPSI_ADDRESS = addresses.SPSI_ADDRESS;
    const PSI_ADDRESS = addresses.PSI_ADDRESS;
    const SYNAPSE_LINK = "https://synapseprotocol.com/?inputCurrency=USDC&outputCurrency=USDC&outputChain=1666600000";
    const MULTICHAIN_LINK = "https://app.multichain.org/#/router";
    const HARMONY_OFFICIAL_LINK = "https://bridge.harmony.one/erc20";

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="psi-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="psi-menu-btn">
                <p>Bridge</p>
            </div>

            <Popper className="psi-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <p className="add-tokens-title">Bridges</p>
                            <Link className="tooltip-item" href={SYNAPSE_LINK} target="_blank">
                                <p>Synapse</p>
                            </Link>
                            <Link className="tooltip-item" href={HARMONY_OFFICIAL_LINK} target="_blank">
                                <p>Harmony One</p>
                            </Link>
                            <Link className="tooltip-item" href={MULTICHAIN_LINK} target="_blank">
                                <p>Multichain</p>
                            </Link>
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default BridgeMenu;
