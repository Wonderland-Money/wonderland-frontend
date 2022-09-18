import { Networks } from "./blockchain";

interface IViewsForNetwork {
    dashboard: boolean;
    stake: boolean;
    mints: boolean;
    calculator: boolean;
    farm: boolean;
    fund: boolean;
    redemption: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
    [Networks.ETH]: {
        dashboard: true,
        stake: false,
        mints: false,
        calculator: false,
        farm: false,
        fund: false,
        redemption: false,
    },
    [Networks.AVAX]: {
        dashboard: true,
        stake: false,
        mints: false,
        calculator: false,
        farm: true,
        fund: false,
        redemption: false,
    },
    [Networks.FANTOM]: {
        dashboard: true,
        stake: false,
        mints: false,
        calculator: false,
        farm: false,
        fund: false,
        redemption: false,
    },
    [Networks.AETH]: {
        dashboard: true,
        stake: false,
        mints: false,
        calculator: false,
        farm: false,
        fund: false,
        redemption: false,
    },
};
