'use client';

import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorMessage } from '@/features/wallet/components/connect/error-message';
import type { WalletConnector } from '@/features/wallet/components/connect/types';

type ConnectDialogContentProps = {
   connectors: readonly WalletConnector[];
   onConnect: (connectorId: string) => void;
   error: string | null;
};

export function ConnectDialogContent({ connectors, onConnect, error }: ConnectDialogContentProps) {
   return (
      <>
         <DialogHeader className="space-y-1 px-6 pt-6 pb-2 text-left">
            <DialogTitle className="text-base font-semibold">Connect wallet</DialogTitle>
            <DialogDescription className="text-xs">Choose a wallet provider to continue.</DialogDescription>
         </DialogHeader>
         <div className="space-y-1.5 px-6 pt-2 pb-6">
            {connectors.length ? (
               connectors.map(connector => (
                  <Button
                     key={connector.id}
                     type="button"
                     variant="outline"
                     onClick={() => onConnect(connector.id)}
                     className="border-border/60 bg-background/60 hover:bg-accent/15 h-10 w-full justify-between rounded-lg px-3"
                  >
                     <span className="flex items-center gap-3">
                        <span className="border-border/50 bg-muted text-muted-foreground grid size-8 place-items-center rounded-md border text-xs font-semibold uppercase">
                           {connector.name.slice(0, 1)}
                        </span>
                        <span className="text-foreground text-sm font-semibold">{connector.name}</span>
                     </span>
                     <ChevronRight className="text-muted-foreground size-4" />
                  </Button>
               ))
            ) : (
               <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-xs">
                  No wallets detected. Install a wallet extension to continue.
               </div>
            )}
            <ErrorMessage error={error} />
         </div>
      </>
   );
}
