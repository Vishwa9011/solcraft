"use client";

import type { ChildrenNode } from "@/lib/types";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Cluster = {
  name: string;
  endpoint: string;
  network?: WalletAdapterNetwork;
}

const defaultClusters: Cluster[] = [
  {
    name: "Devnet",
    endpoint: clusterApiUrl("devnet"),
    network: WalletAdapterNetwork.Devnet,
  },
  {
    name: "Testnet",
    endpoint: clusterApiUrl("testnet"),
    network: WalletAdapterNetwork.Testnet,
  },
  {
    name: "Mainnet Beta",
    endpoint: clusterApiUrl("mainnet-beta"),
    network: WalletAdapterNetwork.Mainnet,
  }
];

const toWalletAdapterNetwork = (network: Network) => {
  switch (network) {
    case "devnet":
      return WalletAdapterNetwork.Devnet;
    case "testnet":
      return WalletAdapterNetwork.Testnet;
    case "mainnet-beta":
      return WalletAdapterNetwork.Mainnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
}

export const networks = ["mainnet-beta", "testnet", "devnet"] as const;
export type Network = typeof networks[number];

type ClusterContextType = {
  cluster: Cluster;
  currentNetwork: Network;
  setNetwork: (network: Network) => void;
  getExplorerUrl: (path: string) => string;
}

const ClusterContext = createContext<ClusterContextType | null>(null);

const ClusterProvider = ({ children }: ChildrenNode) => {
  const [currentNetwork, setNetwork] = useState<Network>("devnet");

  const getExplorerUrl = useCallback((path: string) => {
    return `https://explorer.solana.com/${path}${getExplorerParam(currentNetwork)}`
  }, [currentNetwork]);


  const cluster = useMemo(() => {
    return defaultClusters.find((c) => c.network === toWalletAdapterNetwork(currentNetwork))!;
  }, [currentNetwork]);

  return (
    <ClusterContext.Provider value={{ cluster, currentNetwork, setNetwork, getExplorerUrl }}>
      {children}
    </ClusterContext.Provider>
  );
}

export default ClusterProvider;


export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (!context) {
    throw new Error("useCluster must be used within a ClusterProvider");
  }
  return context;
}


export const getExplorerParam = (network: Network) => {
  let suffix = `?cluster=`
  switch (network) {
    case "devnet":
      return suffix + "devnet";
    case "testnet":
      return suffix + "testnet";
    case "mainnet-beta":
      return "";
    default:
      return suffix + "devnet";
  }
}