'use client';

import { Copy, Globe2, LogOut, Repeat } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/features/wallet/components/connect/error-message';
import type { SolanaNetwork } from '@/lib/solana/networks';
import { cn } from '@/lib/utils';

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
}: ConnectedWalletContentProps) {
   return (
      <div className="space-y-4">
         <div className="border-border/50 bg-card/70 space-y-3 rounded-3xl border p-4 shadow-[0_15px_40px_-20px_rgba(15,23,42,0.8)]">
            <div className="flex items-start justify-between gap-3">
               <div className="flex items-center gap-3">
                  <span
                     className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xs font-semibold tracking-[0.3em] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.35)]',
                        network.accent
                     )}
                  >
                     SOL
                  </span>
                  <div>
                     <div className="flex items-center gap-1">
                        <p className="text-foreground text-sm font-semibold" title={address}>
                           {displayAddress}
                        </p>
                        <Button
                           variant="ghost"
                           size="icon-sm"
                           onClick={onCopy}
                           className="size-6 cursor-pointer border p-0"
                        >
                           <Copy className="size-3" />
                        </Button>
                     </div>
                     <p className="text-muted-foreground text-xs">{network.label}</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="border-border/40 bg-background/80 space-y-2 rounded-3xl border p-3">
            <button
               type="button"
               onClick={onChangeWallet}
               className="border-border/40 bg-card/60 text-foreground hover:border-primary/70 hover:bg-primary/5 flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition"
            >
               <Repeat className="text-muted-foreground size-4" />
               <span>Change wallet</span>
            </button>
            <button
               type="button"
               onClick={onChangeNetwork}
               className="border-border/40 bg-card/60 text-foreground hover:border-primary/70 hover:bg-primary/5 flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition"
            >
               <Globe2 className="text-muted-foreground size-4" />
               <span className="text-xs">Network</span>
               <span className="text-muted-foreground ml-auto text-xs tracking-[0.3em]">{network.cluster}</span>
            </button>
            <div className="flex flex-wrap gap-2">
               <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDisconnect}
                  className="min-w-[120px] flex-1 justify-center gap-2"
               >
                  <LogOut className="size-4" />
                  Disconnect
               </Button>
            </div>
         </div>
         <ErrorMessage error={error} />
      </div>
   );
}
