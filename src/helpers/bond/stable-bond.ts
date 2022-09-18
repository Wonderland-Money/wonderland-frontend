import { ContractInterface, ethers } from "ethers";
import { Bond, BondOpts } from "./bond";
import { BondType } from "./constants";
import { Networks } from "../../constants/blockchain";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddresses } from "../../constants/addresses";
import { BigNumber } from "ethers";

export interface StableBondOpts extends BondOpts {
    readonly reserveContractAbi: ContractInterface;
    readonly tokensInStrategy?: string;
}

export class StableBond extends Bond {
    readonly isLP = false;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;
    readonly tokensInStrategy?: string;

    constructor(stableBondOpts: StableBondOpts) {
        super(BondType.StableAsset, stableBondOpts);

        // For stable bonds the display units are the same as the actual token
        this.displayUnits = stableBondOpts.displayName;
        this.reserveContractAbi = stableBondOpts.reserveContractAbi;
        this.tokensInStrategy = stableBondOpts.tokensInStrategy;
    }

    public async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
        const addresses = getAddresses(networkID);
        const token = this.getContractForReserve(networkID, provider);
        let tokenAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
        if (this.tokensInStrategy) {
            tokenAmount = BigNumber.from(tokenAmount).add(BigNumber.from(this.tokensInStrategy)).toString();
        }
        return tokenAmount / Math.pow(10, 18);
    }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends StableBondOpts {}

export class CustomBond extends StableBond {
    readonly customToken = true;

    constructor(customBondOpts: CustomBondOpts) {
        super(customBondOpts);

        this.getTreasuryBalance = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTreasuryBalance(networkID, provider);
            const tokenPrice = this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };
    }
}

export class StableV2Bond extends Bond {
    readonly isLP = false;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;

    constructor(stableBondOpts: StableBondOpts) {
        super(BondType.StableAsset, stableBondOpts);

        this.displayUnits = stableBondOpts.displayName;
        this.reserveContractAbi = stableBondOpts.reserveContractAbi;
    }

    public async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
        const bondContract = this.getContractForBond(networkID, provider);
        const purchased = await bondContract.totalPrincipalBonded();

        return Number(ethers.utils.formatEther(purchased));
    }
}
