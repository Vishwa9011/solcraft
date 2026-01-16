import { useMemo } from 'react';
import { useWalletSession } from '@solana/react-hooks';
import { createWalletTransactionSigner } from '@solana/client';

export function useWalletSigner() {
   const session = useWalletSession();

   const signer = useMemo(() => {
      if (!session) return null;

      return createWalletTransactionSigner(session, {
         commitment: 'confirmed',
      }).signer;
   }, [session]);

   return signer;
}
