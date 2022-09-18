import axios from "axios";
import { useMemo, useState } from "react";
import { DEBANK_CHAIN_LIST } from "src/constants";
import { ChainInfo } from "./types";

async function fetchChainLint(): Promise<ChainInfo[]> {
    const chainList = await axios.get(DEBANK_CHAIN_LIST);
    return chainList.data;
}

let loadingChainList = false;

export const useChainList = () => {
    const [chainList, setChainList] = useState<ChainInfo[]>();

    if (!loadingChainList) {
        loadingChainList = true;
        fetchChainLint().then(list => setChainList(list));
    }

    return useMemo(() => chainList, [chainList]);
};
