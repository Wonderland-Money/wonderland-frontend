import React, { useCallback, useState, useEffect } from "react";

import axios from "axios";

import "./airdrop-banner.scss";
import { ReactComponent as xIcon } from "../../assets/icons/x.svg";
import { SvgIcon } from "@material-ui/core";
import { useAddress, useWeb3Context } from "../../hooks";

import { AirdropContract } from "../../abi";
import { ethers } from "ethers";

const AirdropContractAddress = "0xEDD1CB10d6DDe82C805f7Fc9988Ee3D89C115e34";

function AirdropBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [userHasAirdrop, setUserHasAirdrop] = useState(false);
    const [checkComplete, setCheckComplete] = useState(false);

    const handleClose = useCallback(() => setShowBanner(false), []);

    const { provider } = useWeb3Context();
    const address = useAddress();

    useEffect(() => {
        async function getData() {
            const userHasAirdrop = await checkIsUserHasAirdrop();
            setUserHasAirdrop(userHasAirdrop);
            setCheckComplete(true);
            setShowBanner(true);
        }
        getData();
    }, []);

    const checkIsClaimed = async () => {
        try {
            const userInfo = await fetchUserInfo();
            const contract = new ethers.Contract(AirdropContractAddress, AirdropContract, provider);
            return await contract.isClaimed(userInfo.index);
        } catch (e) {
            return true; //temp
        }
    };

    const fetchUserInfo = async () => {
        try {
            //"0x000000000000000000000000000000000000dead"
            const url = `https://analytics.back.popsicle.finance/api/v1/bsggairdrop?account=${address}`;
            const { data } = await axios.get(url);
            return data;
        } catch (e) {
            return false;
        }
    };

    const checkIsUserHasAirdrop = async () => {
        try {
            const data = await fetchUserInfo();
            const isAlreadyClaimed = await checkIsClaimed();

            return !!data && !isAlreadyClaimed;
        } catch (e) {
            return false;
        }
    };

    const claimHandler = async () => {
        try {
            const userInfo = await fetchUserInfo();

            const signer = provider.getSigner(address);

            const contract = new ethers.Contract(AirdropContractAddress, AirdropContract, signer);
            const index = userInfo.index;
            const account = address;
            const amount = userInfo.amount;
            const merkleProof = userInfo.proof;

            const estimateGas = await contract.estimateGas.claim(index, account, amount, merkleProof);
            const gasLimit = 1000 + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);

            await contract.claim(index, account, amount, merkleProof);
        } catch (e) {
            // console.log("claimAirdrop err:", e);
            return false;
        }
    };

    if (!showBanner || !address || (!userHasAirdrop && checkComplete)) {
        return null;
    }

    return (
        <div className="airdrop-banner-root">
            <div className="airdrop-banner-text-conteiner">
                <p className="airdrop-banner-text">
                    You are eligible for BSGG airdrop, <br></br> to claim your tokens PLEASE CLICK <span onClick={claimHandler}>HERE</span>
                </p>
            </div>
            <div className="airdrop-banner-close-wrap" onClick={handleClose}>
                <SvgIcon color="primary" component={xIcon} />
            </div>
        </div>
    );
}

export default AirdropBanner;
