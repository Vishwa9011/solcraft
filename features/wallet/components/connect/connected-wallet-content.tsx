'use client';

import { Check, Copy, Globe2, LogOut, Repeat } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/features/wallet/components/connect/error-message';
import type { SolanaNetwork } from '@/lib/solana/networks';

type ConnectedWalletContentProps = {
   address: string;
   displayAddress: string;
   copied: boolean;
   onCopy: () => void;
   onDisconnect: () => void;
   error: string | null;
   network: SolanaNetwork;
   onChangeNetwork: () => void;
   onChangeWallet: () => void;
   walletIcon?: string | null;
   walletName?: string | null;
   balance?: string | null;
   balanceLoading?: boolean;
};

export function ConnectedWalletContent({
   address,
   displayAddress,
   copied,
   onCopy,
   onDisconnect,
   error,
   network,
   onChangeNetwork,
   onChangeWallet,
   walletIcon = null,
   walletName = null,
   balance = null,
   balanceLoading = false,
}: ConnectedWalletContentProps) {
   const balanceValue = balance ? `${balance} SOL` : '—';
   const balanceDisplay = balanceLoading && !balance ? '...' : balanceValue;

   return (
      <div className="space-y-4">
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
         <div className="border-border/40 bg-background/80 space-y-1 rounded-2xl border p-2">
            <Button onClick={onChangeWallet} className="w-full justify-start rounded-2xl px-3 py-2" variant="ghost">
               <Repeat className="text-muted-foreground size-4" />
               <span>Change wallet</span>
            </Button>
            <Button onClick={onChangeNetwork} className="w-full justify-start rounded-2xl px-3 py-2" variant="ghost">
               <Globe2 className="text-muted-foreground size-4" />
               <span>Network</span>
               <span className="text-muted-foreground ml-auto text-xs font-semibold tracking-[0.2em] uppercase">
                  {network.cluster}
               </span>
            </Button>
            <Button
               variant="ghost"
               onClick={onDisconnect}
               className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2 rounded-2xl px-3 py-2"
            >
               <LogOut className="size-4" />
               Disconnect
            </Button>
         </div>
         <ErrorMessage error={error} />
      </div>
   );
}
