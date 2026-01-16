'use client';

import { PropsWithChildren } from 'react';
import { SolanaProvider as SolanaProviderLib } from '@solana/react-hooks';

import { autoDiscover, createClient } from '@solana/client';
import { DEFAULT_SOLANA_NETWORK } from '@/features/wallet/lib/networks';

export const client = createClient({
   cluster: DEFAULT_SOLANA_NETWORK.cluster,
   endpoint: DEFAULT_SOLANA_NETWORK.endpoint,
   websocketEndpoint: DEFAULT_SOLANA_NETWORK.websocketEndpoint,
   walletConnectors: autoDiscover(),
});

export function SolanaProvider({ children }: PropsWithChildren) {
   return <SolanaProviderLib client={client}>{children}</SolanaProviderLib>;
}
