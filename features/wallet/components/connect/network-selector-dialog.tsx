'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SolanaNetwork, SolanaNetworkId } from '@/features/wallet/lib/networks';

const NETWORK_DETAILS: Record<SolanaNetworkId, { badge: string; description: string; accent: string }> = {
   'solana-localnet': {
      badge: 'LOC',
      description: 'Local validator for fast iteration.',
      accent: 'from-[#00ffa3] via-[#4c1d95] to-[#38bdf8]',
   },
   'solana-devnet': {
      badge: 'DEV',
      description: 'Test cluster with dev tokens.',
      accent: 'from-[#8b5cf6] via-[#2563eb] to-[#38bdf8]',
   },
};

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
         <DialogContent className="border-border/60 bg-background/95 max-w-sm rounded-2xl border p-6 shadow-2xl">
            <DialogHeader className="space-y-1 text-left">
               <DialogTitle className="text-foreground text-lg font-semibold">Select network</DialogTitle>
               <DialogDescription className="text-muted-foreground text-sm">
                  Switch your Solana cluster to control which RPC endpoint handles the requests.
               </DialogDescription>
            </DialogHeader>
            <div className="mt-5 space-y-3">
               {networks.map(network => {
                  const isSelected = network.id === selectedNetworkId;
                  const details = NETWORK_DETAILS[network.id];
                  return (
                     <button
                        key={network.id}
                        type="button"
                        onClick={() => onSelectNetwork(network.id)}
                        aria-pressed={isSelected}
                        className={cn(
                           'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition',
                           isSelected
                              ? 'border-primary/40 bg-primary/5'
                              : 'border-border/40 bg-background/60 hover:border-primary/30 hover:bg-accent/40'
                        )}
                     >
                        <div className="flex items-center gap-3">
                           <span
                              className={cn(
                                 'flex h-12 w-12 items-center justify-center rounded-[20px] bg-linear-to-br text-xs font-semibold tracking-[0.3em] text-white uppercase',
                                 details.accent
                              )}
                           >
                              {details.badge}
                           </span>
                           <div>
                              <p className="text-foreground text-sm font-semibold">{network.label}</p>
                              <p className="text-muted-foreground text-xs">{details.description}</p>
                           </div>
                        </div>
                        <span
                           className={cn(
                              'flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                           )}
                        >
                           {isSelected ? <Check className="size-4" /> : null}
                           {isSelected ? 'Connected' : 'Switch'}
                        </span>
                     </button>
                  );
               })}
            </div>
         </DialogContent>
      </Dialog>
   );
}
