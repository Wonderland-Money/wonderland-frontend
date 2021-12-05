export const secondsUntilBlock = (startBlock: number, endBlock: number) => {
    return endBlock - startBlock; // As rinkeby takes 15 secs per block look at src/store/slices/app-slice.ts line 29 *15 removed as time contracts use .timestapm
};
