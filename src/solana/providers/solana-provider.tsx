"use client";

import dynamic from "next/dynamic";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import AppProvider from "@/context/AppProvider";
import { useCluster } from "./cluster-provider";

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton
  , { ssr: false }
);

const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { cluster } = useCluster()

  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const wallets = useMemo(() => {
    return [new SolflareWalletAdapter({ network: cluster.network }),];
  }, [cluster]);

  const onError = useCallback((error: WalletError) => console.error(error), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default SolanaProvider;