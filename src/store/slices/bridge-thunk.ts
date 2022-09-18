import { createAsyncThunk } from "@reduxjs/toolkit";
import { sleep } from "../../helpers";
import { ethers, utils, BigNumber } from "ethers";
import { info, success, warning } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getAddresses, Networks } from "../../constants";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { AnyswapV4RouterContract, wMemoTokenContract } from "../../abi";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { fetchAccountSuccess, loadAccountDetails } from "./account-slice";
import { getGasPrice } from "../../helpers/get-gas-price";

export interface IChangeApproval {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeApproval = createAsyncThunk("bridge/changeApproval", async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const wMemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        approveTx = await wMemoContract.approve(addresses.ANYSWAP_ADDRESS, ethers.constants.MaxUint256, { gasPrice });

        const text = "Approve Bridge";
        const pendingTxnType = "approve_bridge";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const wmemoAllowance = await wMemoContract.allowance(address, addresses.ANYSWAP_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            bridge: {
                wmemo: Number(wmemoAllowance),
            },
        }),
    );
});

interface IBridgeSwap {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    value: string;
    address: string;
    toChain: Networks;
}

export const bridgeSwap = createAsyncThunk("bridge/bridgeSwap", async ({ provider, networkID, value, address, toChain }: IBridgeSwap, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const anyswapContract = new ethers.Contract(addresses.ANYSWAP_ADDRESS, AnyswapV4RouterContract, signer);

    const valueInWei = utils.parseEther(value);

    let swapTx;

    try {
        if (networkID === Networks.AVAX) {
            swapTx = await anyswapContract.anySwapOutUnderlying(addresses.ANY_WMEMO_ADDRESS, address, valueInWei, BigNumber.from(toChain));
        } else {
            swapTx = await anyswapContract["anySwapOut(address,address,uint256,uint256)"](addresses.WMEMO_ADDRESS, address, valueInWei, BigNumber.from(toChain));
        }

        dispatch(
            fetchPendingTxns({
                txnHash: swapTx.hash,
                text: "Bridge",
                type: "bridging",
            }),
        );
        await swapTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err) {
        console.log(err);
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (swapTx) {
            dispatch(clearPendingTxn(swapTx.hash));
        }
    }

    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(loadAccountDetails({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));

    return;
});
