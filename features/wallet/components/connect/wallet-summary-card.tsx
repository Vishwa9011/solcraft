'use client';

import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SolanaNetwork } from '@/features/wallet/lib/networks';
import { formatAddress } from '@/features/wallet/lib';

type WalletSummaryCardProps = {
   address: string;
   copied: boolean;
   onCopy: () => void;
   network: SolanaNetwork;
   balance?: string | null;
   balanceLoading?: boolean;
};

export function WalletSummaryCard({
   address,
   copied,
   onCopy,
   network,
   balance = null,
   balanceLoading = false,
}: WalletSummaryCardProps) {
   const displayAddress = formatAddress(address);
   const balanceValue = balance ? `${balance} SOL` : '—';
   const balanceDisplay = balanceLoading && !balance ? '...' : balanceValue;

   return (
      <div className="border-border/60 bg-card/70 rounded-2xl border p-4 shadow-sm">
         <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 flex-1 items-start">
               <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                     <p className="text-foreground truncate text-sm font-semibold" title={address}>
                        {displayAddress}
                     </p>
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onCopy}
                        aria-label="Copy address"
                        className="border-border/50 size-7 rounded-full border p-0"
                     >
                        {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
                     </Button>
                  </div>
                  <Badge className="border-border/60 bg-background/80 text-muted-foreground w-fit rounded-2xl text-[10px] leading-none tracking-[0.2em] uppercase">
                     {network.cluster}
                  </Badge>
               </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
               <p className="text-muted-foreground text-[10px] leading-none font-semibold tracking-[0.2em] uppercase">
                  Balance
               </p>
               <p
                  className={cn(
                     'text-foreground text-sm leading-none font-semibold tabular-nums',
                     balanceLoading ? 'opacity-60' : null
                  )}
                  title={balanceValue}
               >
                  {balanceDisplay}
               </p>
            </div>
         </div>
      </div>
   );
}
