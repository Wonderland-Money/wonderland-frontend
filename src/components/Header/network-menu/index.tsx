import { useMemo, useState } from "react";
import { Fade, Popper } from "@material-ui/core";
import "./network-manu.scss";
import { useWeb3Context } from "../../../hooks";
import { getChainInfo, getChainList } from "../../../helpers/get-chains";

function NetworkMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { switchNetwork, chainID, connected } = useWeb3Context();
    const chain = useMemo(() => getChainInfo(chainID), [chainID]);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="network-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="network-menu-btn">
                <img className="network-menu-btn-img" alt="" src={chain.img} />
                <p>{chain.shortName}</p>
            </div>

            <Popper className="network-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="network-tooltip">
                            {getChainList(chainID).map((info, index) => (
                                <div className="network-tooltip-item" key={index} onClick={() => connected && switchNetwork(Number(info.chainId))}>
                                    <img className="network-tooltip-item-img" alt="" src={info.img} />
                                    <p>{info.shortName}</p>
                                </div>
                            ))}
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default NetworkMenu;
