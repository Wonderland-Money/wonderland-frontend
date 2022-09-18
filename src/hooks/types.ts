export interface IData {
    name: string;
    chainUrl?: string;
    protocolUrl?: string;
    balance?: number;
    price: number;
    balanceUsd: number;
    images: string[];
    isToken: boolean;
    address: string;
    type?: string;
    protocol?: string;
    chain?: string;
    tokens?: IData[];
}

export interface DataSource {
    total: number;
    wallet?: IData[];
    networks?: IData[];
    protocols?: IData[];
    vaults?: IData[];
    leveragedPosition?: IData[];
    liquidityPool?: IData[];
    claimable?: IData[];
    debt?: IData[];
    farm?: IData[];
}

export interface RawData {
    wallet: IData[];
    vaults: IData[];
    leveragedPosition: IData[];
    liquidityPool: IData[];
    claimable: IData[];
    debt: IData[];
    farm: IData[];
}

export interface ChainInfo {
    id: string;
    name: string;
    logo_url: string;
}

export interface ProtocolInfo {
    id: string;
    chain: string;
    name: string;
    logo_url: string;
}
