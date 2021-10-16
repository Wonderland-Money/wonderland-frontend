import { BONDS } from "../constants";
import { getAddresses } from "../constants";

export const lpURL = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mim_time) {
    return `https://www.traderjoexyz.com/#/pool/${addresses.MIM_ADDRESS}/${addresses.TIME_ADDRESS}`;
  }

  if (bond === BONDS.avax_time) {
    return `https://www.traderjoexyz.com/#/pool/AVAX/${addresses.TIME_ADDRESS}`;
  }

  throw Error(`LP url doesn't support: ${bond}`);
};
