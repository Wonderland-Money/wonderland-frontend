import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { daiAmp } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    console.log("Inside get market price");
    const daiAMPAddress = daiAmp.getAddressForReserve(networkID);
    console.log("a1");
    const pairContract = new ethers.Contract(daiAMPAddress, LpReserveContract, provider);
    console.log("a2");
    const reserves = await pairContract.getReserves();
    console.log("a3");
    const marketPrice = reserves[0] / reserves[1];
    console.log("a4");
    return marketPrice;
}
