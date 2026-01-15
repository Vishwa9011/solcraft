export const queryKeys = {
   factoryConfig: {
      all: ['factory-config-pda'] as const,
   },
   faucetConfig: {
      all: ['faucet-config-pda'] as const,
   },
   faucetRecipient: {
      byAddress: (address?: string | null) => ['faucet-recipient', address ?? 'unknown'] as const,
   },
};
