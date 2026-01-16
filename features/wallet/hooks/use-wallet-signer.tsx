import { useMemo } from 'react';
import { createWalletSigner } from '../lib';
import { useWalletSession } from '@solana/react-hooks';

export function useWalletSigner() {
   const session = useWalletSession();

   const signer = useMemo(() => {
      if (!session) return null;

      return createWalletSigner(session);
   }, [session]);

   return signer;
}
