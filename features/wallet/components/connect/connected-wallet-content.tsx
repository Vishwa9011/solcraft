'use client';

import { Globe2, LogOut, Repeat } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/features/wallet/components/connect/error-message';
import type { SolanaNetwork } from '@/features/wallet/lib/networks';
import { WalletSummaryCard } from '@/features/wallet/components/connect/wallet-summary-card';

type ConnectedWalletContentProps = {
   address: string;
   copied: boolean;
   onCopy: () => void;
   onDisconnect: () => void;
   error: string | null;
   network: SolanaNetwork;
   onChangeNetwork: () => void;
   onChangeWallet: () => void;
   balance?: string | null;
   balanceLoading?: boolean;
};

export function ConnectedWalletContent({
   address,
   copied,
   onCopy,
   onDisconnect,
   error,
   network,
   onChangeNetwork,
   onChangeWallet,
   balance = null,
   balanceLoading = false,
}: ConnectedWalletContentProps) {
   return (
      <div className="space-y-4">
         <WalletSummaryCard
            address={address}
            copied={copied}
            onCopy={onCopy}
            network={network}
            balance={balance}
            balanceLoading={balanceLoading}
         />
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
