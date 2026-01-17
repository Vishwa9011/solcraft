'use client';

import { useMemo } from 'react';
import { useWallet } from '@solana/react-hooks';
import { useFactoryActions } from '@/features/factory/hooks/use-factory-actions';

export type FactoryAdminState = {
   isAdmin: boolean;
   isLoading: boolean;
   isConfigured: boolean;
   adminAddress: string | null;
   connectedAddress: string | null;
};

export function useFactoryAdmin(): FactoryAdminState {
   const wallet = useWallet();
   const { factoryConfig } = useFactoryActions();

   return useMemo(() => {
      const factoryData = factoryConfig.data?.exists ? factoryConfig.data.data : null;
      const isConfigured = Boolean(factoryData);
      const adminAddress = factoryData?.admin?.toString() ?? null;
      const connectedAddress = wallet.status === 'connected' ? wallet.session.account.address.toString() : null;
      const isAdmin = Boolean(adminAddress && connectedAddress && adminAddress === connectedAddress);

      return {
         isAdmin,
         isLoading: factoryConfig.isLoading,
         isConfigured,
         adminAddress,
         connectedAddress,
      };
   }, [factoryConfig.data, factoryConfig.isLoading, wallet]);
}
