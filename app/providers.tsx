"use client";

import { SolanaProvider } from "@solana/react-hooks";
import { PropsWithChildren } from "react";

import { autoDiscover, createClient } from "@solana/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const client = createClient({
  endpoint: "https://api.devnet.solana.com",
  walletConnectors: autoDiscover(),
});

export const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <SolanaProvider client={client}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SolanaProvider>
  );
}
