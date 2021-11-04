import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
// import { mimTime } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    return 0;
    /*
    TODO:
    console.log("Inside get market price");
    const daiAMPAddress = mimTime.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(daiAMPAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
     */
}
