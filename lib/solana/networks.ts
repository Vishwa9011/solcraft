export type SolanaNetworkId = 'solana-mainnet' | 'solana-devnet';

export type SolanaNetwork = {
   id: SolanaNetworkId;
   label: string;
   description: string;
   cluster: string;
   statusLabel: string;
   accent: string;
};

export const SOLANA_NETWORKS: SolanaNetwork[] = [
   {
      id: 'solana-mainnet',
      label: 'Solana (Mainnet)',
      description: 'Live cluster with real SPL liquidity.',
      cluster: 'mainnet-beta',
      statusLabel: 'Connected',
      accent: 'from-[#00ffa3] via-[#4c1d95] to-[#38bdf8]',
   },
   {
      id: 'solana-devnet',
      label: 'Solana (Devnet)',
      description: 'Test cluster with dev tokens.',
      cluster: 'devnet',
      statusLabel: 'Available',
      accent: 'from-[#8b5cf6] via-[#2563eb] to-[#38bdf8]',
   },
];

export const DEFAULT_SOLANA_NETWORK = SOLANA_NETWORKS[0];
