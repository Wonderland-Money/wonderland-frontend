import { EPOCH_INTERVAL } from "../constants";

export const secondsUntilBlock = (startBlock: number, endBlock: number) => {
  if (startBlock % EPOCH_INTERVAL === 0) {
    return 0;
  }
  return endBlock - startBlock;
};
