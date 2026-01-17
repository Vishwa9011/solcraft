'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { formatAddress } from '@/features/wallet/lib';
import { useWalletNetwork } from '@/features/wallet/hooks/use-wallet-network';

type TransactionToastOptions = {
   title: string;
   signature: string;
   description?: string;
};

const EXPLORER_BASE_URL = 'https://explorer.solana.com/tx/';

function getExplorerUrl(signature: string, cluster: string) {
   if (!signature || cluster === 'localnet') {
      return null;
   }

   const suffix = cluster === 'mainnet' || cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
   return `${EXPLORER_BASE_URL}${signature}${suffix}`;
}

export function useTransactionToast() {
   const { selectedNetwork } = useWalletNetwork();

   const notifySuccess = useCallback(
      ({ title, signature, description }: TransactionToastOptions) => {
         const explorerUrl = getExplorerUrl(signature, selectedNetwork.cluster);
         const signatureLabel = formatAddress(signature, 6);

         toast.success(title, {
            description: (
               <div className="text-muted-foreground mt-1 space-y-1 text-xs">
                  {description ? <span className="block">{description}</span> : null}
                  <span className="text-foreground/80 font-mono text-[11px]">{signatureLabel}</span>
               </div>
            ),
            action: explorerUrl
               ? {
                    label: 'View',
                    onClick: () => window.open(explorerUrl, '_blank', 'noopener,noreferrer'),
                 }
               : undefined,
         });
      },
      [selectedNetwork.cluster]
   );

   return { notifySuccess };
}
