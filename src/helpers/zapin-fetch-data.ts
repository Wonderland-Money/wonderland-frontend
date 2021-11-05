import { IToken } from "../helpers/tokens";
import { ethers, utils } from "ethers";
import { IAllBondData } from "../hooks/bonds";
import { getAddresses, Networks } from "../constants";
import axios from "axios";
import { TraderZapinContract } from "../abi";
import { BigNumber } from "ethers";

export const zapinLpData = async (bond: IAllBondData, token: IToken, tokenAmmount: string, network: Networks, slippage: number) => {
    const addresses = getAddresses(network);

    const sellToken = token.isAvax ? ethers.constants.AddressZero : token.address;
    const buyToken = bond.getAddressForReserve(network);

    const url = `https://api.zapper.fi/v1/zap-in/pool/traderjoe/transaction?gasPrice=1000000000000&ownerAddress=${addresses.ZAPIN_ADDRESS}&sellAmount=${tokenAmmount}&sellTokenAddress=${sellToken}&poolAddress=${buyToken}&slippagePercentage=${slippage}&network=avalanche&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&skipGasEstimate=true`;

    const { data } = await axios.get(url);

    const zapinInterface = new utils.Interface(TraderZapinContract);

    const { _swapTarget, swapData } = zapinInterface.decodeFunctionData("ZapIn", data.data);

    return [_swapTarget, swapData, data.minTokens];
};

export const zapinData = async (bond: IAllBondData, token: IToken, tokenAmmount: string, network: Networks, slippage: number) => {
    const sellToken = token.isAvax ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : token.address;
    const buyToken = bond.getAddressForReserve(network);

    const url = `https://avalanche.api.0x.org/swap/v1/quote?buyToken=${buyToken}&includePriceComparisons=true&intentOnFilling=true&sellAmount=${tokenAmmount}&sellToken=${sellToken}&skipValidation=true&slippagePercentage=${slippage}`;
    const { data } = await axios.get(url);

    const dataBuyAmount = BigNumber.from(data.buyAmount);
    const buyAmount = dataBuyAmount.sub(dataBuyAmount.mul(slippage * 1000).div(1000));

    return [data.to, data.data, buyAmount.toString()];
};
