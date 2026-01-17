import { ClusterMoniker } from '@solana/client';

export type SolanaNetworkId = 'solana-localnet' | 'solana-devnet';

export type SolanaNetwork = {
   id: SolanaNetworkId;
   label: string;
   cluster: ClusterMoniker;
   endpoint: string;
   websocketEndpoint: string;
};

export const SOLANA_NETWORKS: SolanaNetwork[] = [
   {
      id: 'solana-localnet',
      label: 'Solana (Localnet)',
      cluster: 'localnet',
      endpoint: 'http://127.0.0.1:8899',
      websocketEndpoint: 'ws://127.0.0.1:8900',
   },
   {
      id: 'solana-devnet',
      label: 'Solana (Devnet)',
      cluster: 'devnet',
      endpoint: 'https://api.devnet.solana.com',
      websocketEndpoint: 'wss://api.devnet.solana.com',
   },
];

export const DEFAULT_SOLANA_NETWORK = SOLANA_NETWORKS[process.env.NODE_ENV === 'development' ? 0 : 1];
