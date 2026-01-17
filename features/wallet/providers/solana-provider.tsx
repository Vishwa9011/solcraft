'use client';

import { PropsWithChildren } from 'react';
import { SolanaProvider as SolanaProviderLib } from '@solana/react-hooks';

import { applySerializableState, autoDiscover, createClient, deserializeSolanaState } from '@solana/client';
import { DEFAULT_SOLANA_NETWORK } from '@/features/wallet/lib/networks';

const STORAGE_KEY = 'solana:last-connector';

const getStoredState = () => {
   if (typeof window === 'undefined') {
      return null;
   }
   const raw = localStorage.getItem(STORAGE_KEY);
   return deserializeSolanaState(raw);
};

const baseConfig = {
   endpoint: DEFAULT_SOLANA_NETWORK.endpoint,
   websocketEndpoint: DEFAULT_SOLANA_NETWORK.websocketEndpoint,
   walletConnectors: autoDiscover(),
};

const clientConfig = applySerializableState(baseConfig, getStoredState());

export const client = createClient({
   ...clientConfig,
});

export function SolanaProvider({ children }: PropsWithChildren) {
   return (
      <SolanaProviderLib client={client} walletPersistence={{ storageKey: STORAGE_KEY }}>
         {children}
      </SolanaProviderLib>
   );
}
