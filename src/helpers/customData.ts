import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import { IData } from "src/hooks/types";
import { Networks } from "../constants/blockchain";
import { simpleProvider } from "./simpleProvider";
import { ConvexStakingWrapperAbra, LpReserveContract, StableReserveContract, CurVyper_contract } from "../abi";
import { ADRESSES_LIST } from "../constants/addresses";
import { getAddresses } from "src/constants";
import { getBsggMarketPrice } from "./get-bsgg-price";
import { getTokenPrice } from "./token-price";

async function getTokenBalance(address: string, network: Networks, token: string) {
    const provider = simpleProvider(network);
    const tokenContract = new ethers.Contract(token, StableReserveContract, provider);
    const balance = await tokenContract.balanceOf(address);
    const decimal = await tokenContract.decimals();
    return balance / Math.pow(10, decimal);
}

function groupData(walletInfo: IData[]): IData[] {
    const wallet: IData[] = [];
    for (const info of walletInfo) {
        const index = wallet.findIndex(i => i.address === info.address);
        if (index !== -1) {
            //@ts-ignore
            wallet[index].balance += info.balance;
            wallet[index].balanceUsd += info.balanceUsd;
        } else {
            wallet.push(info);
        }
    }
    return wallet;
}

async function getBsgg() {
    const name = "BSGG";
    const images = ["https://static.debank.com/image/token/logo_url/0x69570f3e84f51ea70b7b68055c8d667e77735a25/a5e839fb0cd2a63870146955d8e1f3d3.png"];
    const chainUrl = "https://static.debank.com/image/chain/logo_url/ftm/700fca32e0ee6811686d72b99cc67713.png";
    const price = await getBsggMarketPrice();
    const chain = "fantom";
    const addresses = getAddresses(Networks.FANTOM);

    const tokenBalances = await Promise.all(ADRESSES_LIST.map(address => getTokenBalance(address, Networks.FANTOM, addresses.BSGG_ADDRESS)));
    const data: IData[] = tokenBalances.map(balance => ({
        name,
        images,
        chainUrl,
        price,
        chain,
        address: addresses.BSGG_ADDRESS,
        isToken: true,
        balance,
        balanceUsd: balance * price,
    }));
    return groupData(data);
}

async function getMimBsggLpFtm(): Promise<IData[]> {
    const daoAddress = "0xB6b80F4ea8FB4117928D3C819e8aC6F1A3837baF";

    const provider = simpleProvider(Networks.FANTOM);
    const lpContract = new ethers.Contract("0x23320d8f931a52232f1dd9217b25721194cf6812", LpReserveContract, provider);

    const lpBalance = await lpContract.balanceOf(daoAddress);
    const lpTotalSupply = await lpContract.totalSupply();

    const [bsggBalance, mimBalance] = await lpContract.getReserves();

    let daoMimBalance = BigNumber.from(lpBalance).mul(mimBalance).div(lpTotalSupply);
    daoMimBalance = daoMimBalance.sub(daoMimBalance.mul(5).div(1000));
    let daoBsggBalance = BigNumber.from(lpBalance).mul(bsggBalance).div(lpTotalSupply);
    daoBsggBalance = daoBsggBalance.sub(daoBsggBalance.mul(5).div(1000));

    //const bsggPrice = await getBsggMarketPrice();

    const chain = "fantom";
    const chainUrl = "https://static.debank.com/image/chain/logo_url/ftm/700fca32e0ee6811686d72b99cc67713.png";

    return [
        {
            name: "MIM",
            balance: Number(ethers.utils.formatEther(daoMimBalance)),
            price: 1,
            images: ["https://storage.googleapis.com/zapper-fi-assets/tokens/avalanche/0x130966628846bfd36ff31a822705796e8cb8c18d.png"],
            isToken: true,
            balanceUsd: Number(ethers.utils.formatEther(daoMimBalance)),
            address: "0x82f0b8b456c1a451378467398982d4834b6829c1",
            chainUrl,
            chain,
        },
        // {
        //     name: "BSGG",
        //     balance: Number(ethers.utils.formatEther(daoBsggBalance)),
        //     price: 1,
        //     images: ["https://static.debank.com/image/token/logo_url/0x69570f3e84f51ea70b7b68055c8d667e77735a25/a5e839fb0cd2a63870146955d8e1f3d3.png"],
        //     isToken: true,
        //     balanceUsd: Number(ethers.utils.formatEther(daoBsggBalance)) * bsggPrice,
        //     address: "0x23320d8f931a52232f1dd9217b25721194cf6812",
        //     chainUrl,
        //     chain,
        // },
    ];
}

export async function getWallet() {
    const mimBsggLpFtm = await getMimBsggLpFtm();
    return [...mimBsggLpFtm];
}

let loadingWalletData = false;

export const getCustomData = () => {
    const [wallet, setWallet] = useState<IData[]>();

    if (!loadingWalletData) {
        loadingWalletData = true;
        getWallet().then(data => setWallet(data));
    }

    return useMemo(() => ({ wallet }), [wallet]);
};
