'use client';

import { Copy, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/features/wallet/components/connect/error-message';

type ConnectedWalletContentProps = {
   address: string;
   displayAddress: string;
   copied: boolean;
   onCopy: () => void;
   onDisconnect: () => void;
   error: string | null;
};

export function ConnectedWalletContent({
   address,
   displayAddress,
   copied,
   onCopy,
   onDisconnect,
   error,
}: ConnectedWalletContentProps) {
   return (
      <div className="space-y-3">
         <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] tracking-[0.22em] uppercase">Connected wallet</p>
            <p className="text-foreground font-mono text-sm" title={address}>
               {displayAddress}
            </p>
         </div>
         <div className="border-border/60 border-t pt-2">
            <div className="grid gap-1.5">
               <Button type="button" variant="ghost" size="sm" onClick={onCopy} className="justify-start">
                  <Copy className="size-4" />
                  {copied ? 'Copied' : 'Copy address'}
               </Button>
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onDisconnect}
                  className="justify-start text-destructive hover:text-destructive"
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
