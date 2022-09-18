import React from "react";
import "./select-network-dialog.scss";
import { Networks } from "../../../../../../constants/blockchain";
import { getChainList } from "../../../../../../helpers/get-chains";
import { Box, Modal, Paper, SvgIcon, IconButton } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../../../../../assets/icons/x.svg";
import { useWeb3Context } from "../../../../../../hooks";

interface ISelectNetworkDialog {
    open: boolean;
    handleClose: () => void;
    handleSelect: (network: Networks) => void;
}

function SelectNetworkDialog({ open, handleClose, handleSelect }: ISelectNetworkDialog) {
    const { chainID } = useWeb3Context();
    const list = getChainList(chainID);

    return (
        <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
            <Paper className="ohm-card ohm-popover select-network-dialog">
                <div className="cross-wrap">
                    <IconButton onClick={handleClose}>
                        <SvgIcon color="primary" component={XIcon} />
                    </IconButton>
                </div>
                <Box>
                    <div className="select-network-dialog-header">
                        <p className="select-network-dialog-header-title">Choose Network</p>
                    </div>
                    <div className="select-network-dialog-body">
                        {list.map(chain => (
                            <div onClick={() => handleSelect(Number(chain.chainId))} key={chain.chainId} className="select-network-dialog-body-item">
                                <img className="select-network-dialog-body-item-img" src={chain.img} alt="" />
                                <div className="select-network-dialog-body-item-desc">
                                    <p className="select-network-dialog-body-item-name">{chain.chainName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>
            </Paper>
        </Modal>
    );
}

export default SelectNetworkDialog;
