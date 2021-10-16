import { getAddresses, BONDS } from "../constants";

export const addressForAsset = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mim) {
    return addresses.RESERVES.MIM;
  }

  if (bond === BONDS.mim_time) {
    return addresses.RESERVES.MIM_TIME;
  }

  if (bond === BONDS.avax_time) {
    return addresses.RESERVES.AVAX_TIME;
  }

  if (bond === BONDS.wavax) {
    return addresses.RESERVES.WAVAX;
  }

  throw Error(`Address for asset doesn't support: ${bond}`);
};
