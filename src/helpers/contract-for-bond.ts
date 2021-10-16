import { ethers } from "ethers";
import { getAddresses, BONDS } from "../constants";
import { MimBondContract, MimTimeBondContract, WavaxBondContract } from "../abi";

export const contractForBond = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mim) {
    return new ethers.Contract(addresses.BONDS.MIM, MimBondContract, provider);
  }

  if (bond === BONDS.mim_time) {
    return new ethers.Contract(addresses.BONDS.MIM_TIME, MimTimeBondContract, provider);
  }

  if (bond === BONDS.avax_time) {
    return new ethers.Contract(addresses.BONDS.AVAX_TIME, MimTimeBondContract, provider);
  }

  if (bond === BONDS.wavax) {
    return new ethers.Contract(addresses.BONDS.WAVAX, WavaxBondContract, provider);
  }

  throw Error(`Contract for bond doesn't support: ${bond}`);
};
