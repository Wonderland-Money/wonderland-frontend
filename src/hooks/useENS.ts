import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useENS = (address: string) => {
    const [ensName, setENSName] = useState<string | null>(null);

    useEffect(() => {
        const resolveENS = async () => {
            if (ethers.utils.isAddress(address)) {
                const provider = new ethers.providers.JsonRpcProvider("https://cloudflare-eth.com");
                const ensName = await provider.lookupAddress(address);
                setENSName(ensName);
            }
        };
        resolveENS();
    }, [address]);

    return { ensName };
};

export default useENS;
