"use client";

import { SolanaProvider as SolanaProviderLib } from "@solana/react-hooks";
import { PropsWithChildren } from "react";

import { autoDiscover, createClient } from "@solana/client";

export const client = createClient({
  cluster: "localnet",
  endpoint: "http://127.0.0.1:8899",
  // endpoint: "https://api.devnet.solana.com",
  walletConnectors: autoDiscover(),
});

export function SolanaProvider({ children }: PropsWithChildren) {
  return <SolanaProviderLib client={client}>{children}</SolanaProviderLib>;
}
