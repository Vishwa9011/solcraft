export type SolanaNetworkId = 'solana-localnet' | 'solana-devnet';

export type SolanaNetwork = {
   id: SolanaNetworkId;
   label: string;
   description: string;
   cluster: string;
   statusLabel: string;
   accent: string;
   endpoint: string;
   websocketEndpoint: string;
};

export const SOLANA_NETWORKS: SolanaNetwork[] = [
   {
      id: 'solana-localnet',
      label: 'Solana (Localnet)',
      description: 'Local validator for fast iteration.',
      cluster: 'localnet',
      statusLabel: 'Connected',
      accent: 'from-[#00ffa3] via-[#4c1d95] to-[#38bdf8]',
      endpoint: 'http://127.0.0.1:8899',
      websocketEndpoint: 'ws://127.0.0.1:8900',
   },
   {
      id: 'solana-devnet',
      label: 'Solana (Devnet)',
      description: 'Test cluster with dev tokens.',
      cluster: 'devnet',
      statusLabel: 'Available',
      accent: 'from-[#8b5cf6] via-[#2563eb] to-[#38bdf8]',
      endpoint: 'https://api.devnet.solana.com',
      websocketEndpoint: 'wss://api.devnet.solana.com',
   },
];

export const DEFAULT_SOLANA_NETWORK = SOLANA_NETWORKS[0];
