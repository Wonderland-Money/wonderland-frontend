import { Networks } from "../constants/blockchain";
import { wmemoMim } from "../helpers/bond";
import { simpleProvider } from "./simpleProvider";

export async function getWmemoMarketPrice(): Promise<number> {
    const provider = simpleProvider(Networks.AVAX);

    const pairContract = wmemoMim.getContractForReserve(Networks.AVAX, provider);
    const reserves = await pairContract.getReserves();

    const marketPrice = reserves[1] / reserves[0];

    return marketPrice;
}
