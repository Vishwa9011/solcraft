import { useCallback, useMemo } from 'react';
import { useClusterState, useWalletActions } from '@solana/react-hooks';

import {
   DEFAULT_SOLANA_NETWORK,
   SOLANA_NETWORKS,
   type SolanaNetwork,
   type SolanaNetworkId,
} from '@/lib/solana/networks';

type UseWalletNetworkResult = {
   selectedNetwork: SolanaNetwork;
   switchNetwork: (networkId: SolanaNetworkId) => Promise<void>;
};

export function useWalletNetwork(): UseWalletNetworkResult {
   const clusterState = useClusterState();
   const { setCluster } = useWalletActions();

   const selectedNetwork = useMemo(
      () => SOLANA_NETWORKS.find(network => network.endpoint === clusterState.endpoint) ?? DEFAULT_SOLANA_NETWORK,
      [clusterState.endpoint]
   );

   const switchNetwork = useCallback(
      async (networkId: SolanaNetworkId) => {
         const network = SOLANA_NETWORKS.find(candidate => candidate.id === networkId);
         if (!network) {
            throw new Error('Unknown network');
         }
         await setCluster(network.endpoint, {
            commitment: 'confirmed',
            websocketEndpoint: network.websocketEndpoint,
         });
      },
      [setCluster]
   );

   return { selectedNetwork, switchNetwork };
}
