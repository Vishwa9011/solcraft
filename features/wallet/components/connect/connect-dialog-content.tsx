'use client';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorMessage } from '@/features/wallet/components/connect/error-message';
import type { WalletConnector } from '@/features/wallet/components/connect/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ConnectDialogContentProps = {
   connectors: readonly WalletConnector[];
   onConnect: (connectorId: string) => void;
   error: string | null;
   connectingId?: string | null;
   isReady?: boolean;
};

export function ConnectDialogContent({
   connectors,
   onConnect,
   error,
   connectingId = null,
   isReady = true,
}: ConnectDialogContentProps) {
   return (
      <div className="space-y-6 px-6 pt-5 pb-6 text-left">
         <DialogHeader className="space-y-2">
            <DialogTitle className="text-foreground text-xl font-semibold">Connect a wallet</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
               Choose a wallet provider on Solana to continue. Detected wallets are highlighted below.
            </DialogDescription>
         </DialogHeader>
         <div className="space-y-3">
            {!isReady ? (
               <div className="border-border/40 bg-card/40 text-muted-foreground rounded-2xl border border-dashed px-4 py-3 text-sm">
                  Detecting wallet extensions...
               </div>
            ) : connectors.length ? (
               connectors.map(connector => {
                  const isDetected = connector.ready !== false;
                  const isConnecting = connectingId === connector.id;
                  const isDisabled = connectingId !== null || !isDetected;
                  const statusText =
                     connector.ready === false ? 'Not installed' : connector.ready === true ? 'Detected' : null;
                  return (
                     <Button
                        key={connector.id}
                        type="button"
                        variant="ghost"
                        onClick={() => onConnect(connector.id)}
                        disabled={isDisabled}
                        aria-busy={isConnecting}
                        className={cn(
                           'group flex h-auto w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                           isDetected
                              ? 'border-primary/30 bg-primary/5'
                              : 'border-border/40 bg-background/60 hover:border-primary/20 hover:bg-accent/40'
                        )}
                     >
                        <span className="flex items-center gap-3">
                           <span
                              className={cn(
                                 'border-border/40 bg-muted/30 grid h-10 w-10 place-items-center rounded-2xl border',
                                 isDetected ? 'border-primary/20' : null
                              )}
                           >
                              {connector.icon ? (
                                 <img src={connector.icon} alt="" className="h-6 w-6" />
                              ) : (
                                 <span className="text-muted-foreground text-xs font-semibold uppercase">
                                    {connector.name.slice(0, 1)}
                                 </span>
                              )}
                           </span>
                           <div className="text-left">
                              <p className="text-foreground text-sm font-semibold">{connector.name}</p>
                              {statusText ? <p className="text-muted-foreground text-xs">{statusText}</p> : null}
                           </div>
                        </span>
                        <span className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
                           {isConnecting ? <Loader2 className="size-3 animate-spin" /> : null}
                           {isConnecting ? 'Connecting' : isDetected ? 'Connect' : 'Install'}
                        </span>
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
