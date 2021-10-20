import { prettifySeconds } from "./prettify-seconds";
import { secondsUntilBlock } from "./seconds-until-block";

export const prettyVestingPeriod = (currentBlock: number, vestingBlock: number) => {
    if (vestingBlock === 0) {
        return "";
    }

    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    if (seconds < 0) {
        return "Fully Vested";
    }
    return prettifySeconds(seconds);
};
