import { Networks } from "../../constants/blockchain";

export enum BondType {
    StableAsset,
    LP,
}

export interface BondAddresses {
    reserveAddress: string;
    bondAddress: string;
}

export type NetworkAddresses = { [key in Networks]?: BondAddresses };
export type Available = { [key in Networks]?: boolean };
