import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { Networks } from "../constants/blockchain";
import { getAddresses } from "../constants/addresses";
import { simpleProvider } from "./simpleProvider";

export async function getBsggMarketPrice(): Promise<number> {
    const provider = simpleProvider(Networks.AVAX);
    const addresses = getAddresses(Networks.AVAX);
    const pairContract = new ethers.Contract(addresses.BSGG_MIM_LP, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
