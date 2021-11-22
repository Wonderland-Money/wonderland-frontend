import { BondType, NetworkAddresses } from "./constants";
import { Networks } from "../../constants/blockchain";
import { ContractInterface, Contract } from "ethers";
import React from "react";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { getTokenPrice } from "../token-price";

export interface BondOpts {
    readonly name: string; // Internal name used for references
    readonly displayName: string; // Displayname on UI
    readonly bondIconSvg: string; //  SVG path for icons
    readonly bondContractABI: ContractInterface; // ABI for contract
    readonly networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
    readonly bondToken: string; // Unused, but native token to buy the bond.
}

export abstract class Bond {
    public readonly name: string;
    public readonly displayName: string;
    public readonly type: BondType;
    public readonly bondIconSvg: string;
    public readonly bondContractABI: ContractInterface; // Bond ABI
    public readonly networkAddrs: NetworkAddresses;
    public readonly bondToken: string;
    public readonly lpUrl?: string;
    public readonly tokensInStrategy?: string;

    // The following two fields will differ on how they are set depending on bond type
    public abstract isLP: boolean;
    protected abstract reserveContractAbi: ContractInterface; // Token ABI
    public abstract displayUnits: string;

    // Async method that returns a Promise
    public abstract getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider): Promise<number>;
    public abstract getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider): Promise<number>;
    public abstract getTimeAmount(networkID: Networks, provider: StaticJsonRpcProvider): Promise<number>;

    constructor(type: BondType, bondOpts: BondOpts) {
        this.name = bondOpts.name;
        this.displayName = bondOpts.displayName;
        this.type = type;
        this.bondIconSvg = bondOpts.bondIconSvg;
        this.bondContractABI = bondOpts.bondContractABI;
        this.networkAddrs = bondOpts.networkAddrs;
        this.bondToken = bondOpts.bondToken;
    }

    public getAddressForBond(networkID: Networks) {
        return this.networkAddrs[networkID].bondAddress;
    }

    public getContractForBond(networkID: Networks, provider: StaticJsonRpcProvider | JsonRpcSigner) {
        const bondAddress = this.getAddressForBond(networkID);
        return new Contract(bondAddress, this.bondContractABI, provider);
    }

    public getAddressForReserve(networkID: Networks) {
        return this.networkAddrs[networkID].reserveAddress;
    }

    public getContractForReserve(networkID: Networks, provider: StaticJsonRpcProvider | JsonRpcSigner) {
        const reserveAddress = this.getAddressForReserve(networkID);
        return new Contract(reserveAddress, this.reserveContractAbi, provider);
    }

    protected getTokenPrice(): number {
        return getTokenPrice(this.bondToken);
    }
}
