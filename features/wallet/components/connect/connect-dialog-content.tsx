'use client';

import { cn } from '@/lib/utils';
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
      <div className="space-y-6 px-6 pt-5 pb-6 text-left">
         <DialogHeader className="space-y-2">
            <DialogTitle className="text-foreground text-xl font-semibold">Connect a wallet</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
               Choose a wallet provider on Solana to continue. Detected wallets are highlighted below.
            </DialogDescription>
         </DialogHeader>
         <div className="space-y-3">
            {connectors.length ? (
               connectors.map(connector => {
                  return (
                     <Button
                        key={connector.id}
                        type="button"
                        variant="ghost"
                        onClick={() => onConnect(connector.id)}
                        className={cn(
                           'group flex h-auto w-full items-center justify-between rounded-2xl border px-4 py-3 shadow-sm transition'
                        )}
                     >
                        <span className="flex items-center gap-3">
                           <span className="border-border/40 bg-muted/20 text-muted-foreground grid h-10 w-10 place-items-center rounded-2xl border text-xs font-semibold uppercase">
                              {connector.name.slice(0, 1)}
                           </span>
                           <div className="text-left">
                              <p className="text-foreground text-sm font-semibold">{connector.name}</p>
                           </div>
                        </span>
                        <span className="text-muted-foreground text-xs font-semibold">Connect</span>
                     </Button>
                  );
               })
            ) : (
               <div className="border-border/40 bg-card/40 text-muted-foreground rounded-2xl border border-dashed px-4 py-3 text-sm">
                  No wallets detected. Install a wallet extension to continue.
               </div>
            )}
         </div>
         <ErrorMessage error={error} />
      </div>
   );
}
