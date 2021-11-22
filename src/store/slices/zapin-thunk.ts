import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { messages } from "../../constants/messages";
import { getAddresses, Networks } from "../../constants";
import { IToken } from "../../helpers/tokens";
import { info, success, warning } from "./messages-slice";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { getGasPrice } from "../../helpers/get-gas-price";
import { ethers } from "ethers";
import { MimTokenContract, ZapinContract } from "../../abi";
import { calculateUserBondDetails, fetchAccountSuccess } from "./account-slice";
import { IAllBondData } from "../../hooks/bonds";
import { zapinData, zapinLpData } from "../../helpers/zapin-fetch-data";
import { trim } from "../../helpers/trim";
import { sleep } from "../../helpers";

interface IChangeApproval {
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("zapin/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
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

        approveTx = await tokenContract.approve(addresses.ZAPIN_ADDRESS, ethers.constants.MaxUint256, { gasPrice });

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

    const tokenAllowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            tokens: {
                [token.name]: {
                    allowance: Number(tokenAllowance),
                },
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
}

export interface ITokenZapinResponse {
    swapTarget: string;
    swapData: string;
    amount: string;
    value: string;
}

export const calcZapinDetails = async ({ token, provider, networkID, bond, value, slippage, dispatch }: ITokenZapin): Promise<ITokenZapinResponse> => {
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
            [swapTarget, swapData, amount] = await zapinLpData(bond, token, valueInWei, networkID, acceptedSlippage);
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
    minReturnAmount: string;
    swapTarget: string;
    swapData: string;
    slippage: number;
    address: string;
}

export const zapinMint = createAsyncThunk(
    "zapin/zapinMint",
    async ({ provider, networkID, bond, token, value, minReturnAmount, swapTarget, swapData, slippage, address }: IZapinMint, { dispatch }) => {
        if (!provider) {
            dispatch(warning({ text: messages.please_connect_wallet }));
            return;
        }
        const acceptedSlippage = slippage / 100 || 0.02;
        const addresses = getAddresses(networkID);
        const depositorAddress = address;

        const signer = provider.getSigner();
        const zapinContract = new ethers.Contract(addresses.ZAPIN_ADDRESS, ZapinContract, signer);

        const bondAddress = bond.getAddressForBond(networkID);
        const valueInWei = trim(Number(value) * Math.pow(10, token.decimals));

        const bondContract = bond.getContractForBond(networkID, signer);

        const calculatePremium = await bondContract.bondPrice();
        const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

        let zapinTx;
        try {
            const gasPrice = await getGasPrice(provider);

            if (bond.isLP) {
                if (token.isAvax) {
                    zapinTx = await zapinContract.ZapInLp(
                        ethers.constants.AddressZero,
                        bondAddress,
                        valueInWei,
                        minReturnAmount,
                        swapTarget,
                        swapData,
                        true,
                        maxPremium,
                        depositorAddress,
                        { value: valueInWei, gasPrice },
                    );
                } else {
                    zapinTx = await zapinContract.ZapInLp(token.address, bondAddress, valueInWei, minReturnAmount, swapTarget, swapData, true, maxPremium, depositorAddress, {
                        gasPrice,
                    });
                }
            } else {
                if (token.isAvax) {
                    zapinTx = await zapinContract.ZapIn(
                        ethers.constants.AddressZero,
                        bondAddress,
                        valueInWei,
                        minReturnAmount,
                        swapTarget,
                        swapData,
                        maxPremium,
                        depositorAddress,
                        { value: valueInWei, gasPrice },
                    );
                } else {
                    zapinTx = await zapinContract.ZapIn(token.address, bondAddress, valueInWei, minReturnAmount, swapTarget, swapData, maxPremium, depositorAddress, { gasPrice });
                }
            }

            dispatch(
                fetchPendingTxns({
                    txnHash: zapinTx.hash,
                    text: "Zapin " + token.name,
                    type: "zapin_" + token.name + "_" + bond.name,
                }),
            );
            await zapinTx.wait();
            dispatch(success({ text: messages.tx_successfully_send }));
            await sleep(0.01);
            dispatch(info({ text: messages.your_balance_update_soon }));
            await sleep(10);
            await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
            dispatch(info({ text: messages.your_balance_updated }));
            return;
        } catch (err) {
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (zapinTx) {
                dispatch(clearPendingTxn(zapinTx.hash));
            }
        }
    },
);
