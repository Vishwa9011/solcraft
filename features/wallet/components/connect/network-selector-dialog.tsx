'use client';

import * as React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SolanaNetwork, SolanaNetworkId } from '@/lib/solana/networks';
import { cn } from '@/lib/utils';

type NetworkSelectorDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   selectedNetworkId: SolanaNetworkId;
   onSelectNetwork: (networkId: SolanaNetworkId) => void;
   networks: readonly SolanaNetwork[];
};

export function NetworkSelectorDialog({
   open,
   onOpenChange,
   networks,
   selectedNetworkId,
   onSelectNetwork,
}: NetworkSelectorDialogProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="border-border/60 bg-background/95 max-w-sm rounded-[32px] border p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]">
            <DialogHeader className="space-y-1 text-left">
               <DialogTitle className="text-foreground text-lg font-semibold">Select network</DialogTitle>
               <DialogDescription className="text-muted-foreground text-sm">
                  Switch your Solana cluster to control which RPC endpoint handles the requests.
               </DialogDescription>
            </DialogHeader>
            <div className="mt-5 space-y-3">
               {networks.map(network => {
                  const isSelected = network.id === selectedNetworkId;
                  return (
                     <button
                        key={network.id}
                        type="button"
                        onClick={() => onSelectNetwork(network.id)}
                        className={cn(
                           'flex w-full items-center justify-between gap-3 rounded-3xl border px-4 py-4 text-left transition',
                           isSelected
                              ? 'border-primary/80 bg-primary/5'
                              : 'border-border/30 bg-card/60 hover:border-primary/50 hover:bg-primary/5'
                        )}
                     >
                        <div className="flex items-center gap-3">
                           <span
                              className={cn(
                                 'flex h-14 w-14 items-center justify-center rounded-[24px] bg-linear-to-br text-sm font-semibold tracking-[0.4em] uppercase',
                                 network.accent
                              )}
                           >
                              {network.id === 'solana-mainnet' ? 'SOL' : 'DEV'}
                           </span>
                           <div>
                              <p className="text-foreground text-sm font-semibold">{network.label}</p>
                              <p className="text-muted-foreground text-xs">{network.description}</p>
                           </div>
                        </div>
                        <span
                           className={cn(
                              'text-xs font-semibold tracking-[0.3em] uppercase',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                           )}
                        >
                           {isSelected ? network.statusLabel : 'Switch'}
                        </span>
                     </button>
                  );
               })}
            </div>
         </DialogContent>
      </Dialog>
   );
}
