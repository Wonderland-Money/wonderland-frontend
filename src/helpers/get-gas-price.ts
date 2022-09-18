import { JsonRpcProvider } from "@ethersproject/providers";
import { utils, BigNumber } from "ethers";

const GAS = "5";

export const getGasPrice = async (provider: JsonRpcProvider) => {
    const gasPrice = await provider.getGasPrice();
    const convertGas = utils.parseUnits(GAS, "gwei");
    return gasPrice.add(convertGas);
    //return BigNumber.from(0);
};
