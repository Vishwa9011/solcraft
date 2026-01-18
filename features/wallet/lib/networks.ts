import { env } from '@/lib';
import { ClusterMoniker } from '@solana/client';

export type SolanaNetworkId = 'solana-localnet' | 'solana-devnet';

export type SolanaNetwork = {
   id: SolanaNetworkId;
   label: string;
   cluster: ClusterMoniker;
   endpoint: string;
   websocketEndpoint: string;
};

const LOCALNET_NETWORK: SolanaNetwork = {
   id: 'solana-localnet',
   label: 'Solana (Localnet)',
   cluster: 'localnet',
   endpoint: 'http://127.0.0.1:8899',
   websocketEndpoint: 'ws://127.0.0.1:8900',
};

const DEVNET_NETWORK: SolanaNetwork = {
   id: 'solana-devnet',
   label: 'Solana (Devnet)',
   cluster: 'devnet',
   endpoint: 'https://api.devnet.solana.com',
   websocketEndpoint: 'wss://api.devnet.solana.com',
};

const IS_DEV = env.NEXT_PUBLIC_NODE_ENV === 'development';

export const SOLANA_NETWORKS: SolanaNetwork[] = IS_DEV ? [LOCALNET_NETWORK, DEVNET_NETWORK] : [DEVNET_NETWORK];

export const DEFAULT_SOLANA_NETWORK = SOLANA_NETWORKS[0];
