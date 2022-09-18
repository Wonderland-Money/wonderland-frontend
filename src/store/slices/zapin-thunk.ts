import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { messages } from "../../constants/messages";
import { getAddresses, Networks } from "../../constants";
import { IToken } from "../../helpers/tokens";
import { info, success, warning } from "./messages-slice";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { getGasPrice } from "../../helpers/get-gas-price";
import { ethers, utils, BigNumber } from "ethers";
import { MimTokenContract } from "../../abi";
import { calculateUserBondDetails, calculateUserTokenDetails, fetchAccountSuccess } from "./account-slice";
import { IAllBondData } from "../../hooks/bonds";
import { zapinData, zapinLpData } from "../../helpers/zapin-fetch-data";
import { trim } from "../../helpers/trim";
import { sleep } from "../../helpers";
import { avax, mim, wavax } from "../../helpers/tokens";

interface IChangeApproval {
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
    bond: IAllBondData;
}

export const changeApproval = createAsyncThunk("zapin/changeApproval", async ({ token, provider, address, networkID, bond }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(token.address, MimTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (bond.isLP) {
            approveTx = await tokenContract.approve(addresses.ZAPIN_LP_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        } else {
            approveTx = await tokenContract.approve(addresses.ZAPIN_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = "Approve " + token.name;
        const pendingTxnType = "approve_" + token.address;

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

    let tokenData: any = {};

    if (bond.isLP) {
        const allowance = await tokenContract.allowance(address, addresses.ZAPIN_LP_ADDRESS);
        tokenData.allowanceLp = Number(allowance);
    } else {
        const allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
        tokenData.allowance = Number(allowance);
    }

    return dispatch(
        fetchAccountSuccess({
            tokens: {
                [token.name]: tokenData,
            },
        }),
    );
});

interface ITokenZapin {
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    bond: IAllBondData;
    slippage: number;
    value: string;
    dispatch: Dispatch<any>;
    address: string;
}

export interface ITokenZapinResponse {
    swapTarget: string;
    swapData: string;
    amount: string;
    value: string;
}

export const calcZapinDetails = async ({ token, provider, networkID, bond, value, slippage, dispatch, address }: ITokenZapin): Promise<ITokenZapinResponse> => {
    let swapTarget: string = "";
    let swapData: string = "";
    let amount: string = "";

    const acceptedSlippage = slippage / 100 || 0.02;

    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return {
            swapTarget,
            swapData,
            amount,
            value,
        };
    }

    if (acceptedSlippage < 0.001) {
        dispatch(warning({ text: messages.slippage_too_small }));
        return {
            swapTarget,
            swapData,
            amount,
            value,
        };
    }

    if (acceptedSlippage > 1) {
        dispatch(warning({ text: messages.slippage_too_big }));
        return {
            swapTarget,
            swapData,
            amount,
            value,
        };
    }

    const valueInWei = trim(Number(value) * Math.pow(10, token.decimals));

    try {
        if (bond.isLP) {
            [swapTarget, swapData, amount] = await zapinLpData(bond, token, valueInWei, networkID, acceptedSlippage, address);
        } else {
            [swapTarget, swapData, amount] = await zapinData(bond, token, valueInWei, networkID, acceptedSlippage);
        }
    } catch (err) {
        metamaskErrorWrap(err, dispatch);
    }

    return {
        swapTarget,
        swapData,
        amount,
        value,
    };
};

interface IZapinMint {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    bond: IAllBondData;
    token: IToken;
    value: string;
    swapTarget: string;
    swapData: string;
    address: string;
}

export const zapinMint = createAsyncThunk("zapin/zapinMint", async ({ provider, networkID, bond, token, value, swapTarget, swapData, address }: IZapinMint, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();

    let transferTx;

    try {
        const gasPrice = await getGasPrice(provider);

        transferTx = await signer.sendTransaction({
            to: swapTarget,
            data: swapData,
            gasPrice,
            value: token.isAvax ? utils.parseEther(value) : BigNumber.from("0"),
        });

        dispatch(
            fetchPendingTxns({
                txnHash: transferTx.hash,
                text: "Zapin " + token.name,
                type: "zapin_" + token.name + "_" + bond.name,
            }),
        );

        await transferTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
        await sleep(0.01);
        dispatch(info({ text: messages.your_balance_update_soon }));
        await sleep(10);
        await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));

        for (const _token of [avax, mim, wavax, token]) {
            await dispatch(calculateUserTokenDetails({ address, networkID, provider, token: _token }));
        }
    } catch (err) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (transferTx) {
            dispatch(clearPendingTxn(transferTx.hash));
        }
    }
});
