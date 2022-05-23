export const TOKEN_DECIMALS = 9;

export enum Networks {
    ONE = 1666600000,
    AVAX = 43114,
}

export const DEFAULT_NETWORK = Networks.AVAX;

// Make sure this is a valid way to check
export const checkValidNetwork = (chainId: Number) => {
    switch (chainId) {
        case Networks.ONE:
            return true;
        case Networks.AVAX:
            return true;
    }
    return false;
};
