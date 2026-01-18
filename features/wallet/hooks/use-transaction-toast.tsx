'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { formatAddress } from '@/features/wallet/lib';
import { useWalletNetwork } from '@/features/wallet/hooks/use-wallet-network';
import type { SolanaNetwork } from '@/features/wallet/lib/networks';

type TransactionToastOptions = {
   signature: string;
   title?: string;
   description?: string;
};

const EXPLORER_BASE_URL = 'https://explorer.solana.com/tx/';

function getExplorerUrl(signature: string, network: SolanaNetwork) {
   if (!signature) {
      return null;
   }

   if (network.cluster === 'localnet') {
      const customUrl = encodeURIComponent(network.endpoint);
      return `${EXPLORER_BASE_URL}${signature}?cluster=custom&customUrl=${customUrl}`;
   }

   const suffix =
      network.cluster === 'mainnet' || network.cluster === 'mainnet-beta' ? '' : `?cluster=${network.cluster}`;
   return `${EXPLORER_BASE_URL}${signature}${suffix}`;
}

export function useTransactionToast() {
   const { selectedNetwork } = useWalletNetwork();

   const notifySuccess = useCallback(
      ({ title = 'Transaction submitted', signature, description }: TransactionToastOptions) => {
         const explorerUrl = getExplorerUrl(signature, selectedNetwork);
         const signatureLabel = formatAddress(signature, 6);

         toast.success(title, {
            description: (
               <div className="mt-1 space-y-1 text-xs">
                  {description ? <span className="text-foreground/80 block">{description}</span> : null}
                  <span className="text-muted-foreground flex items-center gap-2">
                     <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Signature</span>
                     <span className="text-foreground/80 font-mono text-[11px]" title={signature}>
                        {signatureLabel}
                     </span>
                  </span>
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
      [selectedNetwork]
   );

   return { notifySuccess };
}
