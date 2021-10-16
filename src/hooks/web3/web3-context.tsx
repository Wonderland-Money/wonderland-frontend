import React, { useState, ReactElement, useContext, useMemo, useCallback } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getTestnetURI, getMainnetURI } from "./helpers";
import { DEFAULD_NETWORK } from "../../constants";
import { Networks } from "../../constants";

type onChainProvider = {
  connect: () => Promise<Web3Provider>;
  disconnect: () => void;
  checkWrongNetwork: () => boolean;
  provider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
  chainID: number;
  web3?: any;
  providerChainID: number;
  hasCachedProvider: () => boolean;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(DEFAULD_NETWORK);
  const [providerChainID, setProviderChainID] = useState(DEFAULD_NETWORK);
  const [address, setAddress] = useState("");

  const [uri, setUri] = useState(chainID === Networks.AVAX ? getMainnetURI() : getTestnetURI());
  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));

  const [web3Modal] = useState<Web3Modal>(
    new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              [Networks.AVAX]: getMainnetURI(),
              [Networks.RINKEBY]: getTestnetURI(),
            },
          },
        },
      },
    }),
  );

  const hasCachedProvider = (): boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  const _initListeners = useCallback(
    (rawProvider: JsonRpcProvider) => {
      if (!rawProvider.on) {
        return;
      }

      rawProvider.on("accountsChanged", () => setTimeout(() => window.location.reload(), 1));

      rawProvider.on("chainChanged", async (chain: number) => {
        changeNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork, oldNetwork) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  const changeNetwork = async (otherChainID: number) => {
    const network = Number(otherChainID);

    setProviderChainID(network);

    if (chainID !== network) {
      console.warn("You are switching networks: ", network);
      if (network === Networks.AVAX || network === Networks.RINKEBY) {
        setChainID(network);
        network === Networks.RINKEBY ? setUri(getMainnetURI()) : setUri(getTestnetURI());
      }
    }
  };

  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();

    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, "any");

    const chainId = await connectedProvider.getNetwork().then(network => Number(network.chainId));
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    setAddress(connectedAddress);

    setProviderChainID(chainId);

    if (chainId === Networks.AVAX || chainId === Networks.RINKEBY) {
      setProvider(connectedProvider);
    }

    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const checkWrongNetwork = (): boolean => {
    if (providerChainID !== DEFAULD_NETWORK) {
      alert("Please connect your wallet to Avalanche network to use Wonderland!");
      return true;
    }

    return false;
  };

  const disconnect = useCallback(async () => {
    console.log("disconnecting");
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      web3Modal,
      providerChainID,
      checkWrongNetwork,
    }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal, providerChainID],
  );
  //@ts-ignore
  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
