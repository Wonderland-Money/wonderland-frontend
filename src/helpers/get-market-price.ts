import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { daiCup } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const daiCUPAddress = daiCup.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(daiCUPAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[1] / reserves[0]; // Reversed (TODO:  be careful)
    return marketPrice;
}
