import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { daiAmp } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const daiAMPAddress = daiAmp.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(daiAMPAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
