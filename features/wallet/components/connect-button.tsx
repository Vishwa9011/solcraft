'use client';

import { useState } from 'react';
import { useConnectWallet, useDisconnectWallet, useWallet, useWalletConnection } from '@solana/react-hooks';
import { ChevronDown, ChevronUp, LogOut, Sparkles, Wallet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function truncate(address: string) {
   return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function ConnectButton() {
   const wallet = useWallet();
   const { connectors } = useWalletConnection();
   const connectWallet = useConnectWallet();
   const disconnectWallet = useDisconnectWallet();
   const [error, setError] = useState<string | null>(null);
   const [open, setOpen] = useState(false);

   const isConnected = wallet.status === 'connected';
   const address = isConnected ? wallet.session.account.address.toString() : null;

   async function handleConnect(connectorId: string) {
      setError(null);
      try {
         await connectWallet(connectorId, { autoConnect: true });
         setOpen(false);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to connect');
      }
   }

   async function handleDisconnect() {
      setError(null);
      try {
         await disconnectWallet();
         setOpen(false);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to disconnect');
      }
   }

   const menuId = 'wallet-menu';
   const connectionLabel = address ? truncate(address) : 'Connect wallet';

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               type="button"
               variant="outline"
               aria-expanded={open}
               aria-controls={menuId}
               className={cn(
                  'group border-border/60 bg-card/50 hover:border-border/80 hover:bg-card/80 relative h-14 w-full max-w-sm justify-between overflow-hidden rounded-2xl px-4 text-left shadow-sm transition',
                  isConnected ? 'ring-primary/30 ring-1' : 'ring-border/50 ring-1'
               )}
            >
               <span className="from-primary/20 pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
               <span className="relative flex items-center gap-3">
                  <span
                     className={cn(
                        'border-border/50 bg-background/70 text-muted-foreground group-hover:border-border/80 flex size-10 items-center justify-center rounded-xl border transition',
                        isConnected && 'text-primary'
                     )}
                  >
                     <Wallet className="size-4" />
                  </span>
                  <span className="flex flex-col">
                     <span className="text-foreground text-sm font-semibold">{connectionLabel}</span>
                     <span className="text-muted-foreground text-xs">
                        {isConnected ? 'Wallet connected' : 'Solana Devnet'}
                     </span>
                  </span>
               </span>
               <span className="text-muted-foreground relative flex items-center gap-2 text-xs font-semibold">
                  {isConnected ? 'Manage' : 'Select'}
                  {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
               </span>
            </Button>
         </PopoverTrigger>
         <PopoverContent
            id={menuId}
            align="start"
            sideOffset={12}
            className="border-border/60 bg-popover/95 w-[var(--radix-popper-anchor-width)] max-w-[calc(100vw-2rem)] min-w-[260px] p-0 shadow-xl backdrop-blur"
         >
            <Card className="border-0 bg-transparent shadow-none">
               <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                     <CardTitle className="flex items-center gap-2 text-sm">
                        <Sparkles className="text-primary size-4" />
                        Wallet Access
                     </CardTitle>
                     {isConnected ? (
                        <Badge variant="secondary" className="gap-1">
                           <span className="bg-primary size-1.5 rounded-full" />
                           Connected
                        </Badge>
                     ) : (
                        <Badge variant="outline">Not connected</Badge>
                     )}
                  </div>
                  <CardDescription className="text-xs">
                     {isConnected
                        ? 'Manage your wallet connection and keep mint access active.'
                        : 'Choose a wallet to connect and start minting SPL tokens.'}
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                  {isConnected ? (
                     <div className="space-y-3">
                        <div className="border-border/50 bg-muted/30 rounded-xl border px-3 py-2">
                           <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                              Active address
                           </p>
                           <p className="text-foreground mt-1 font-mono text-sm">{address ? truncate(address) : ''}</p>
                        </div>
                        <Button
                           type="button"
                           variant="secondary"
                           onClick={() => void handleDisconnect()}
                           className="w-full justify-between rounded-xl"
                        >
                           <span className="flex items-center gap-2">
                              <LogOut className="size-4" />
                              Disconnect
                           </span>
                           <span className="text-muted-foreground text-xs">End session</span>
                        </Button>
                     </div>
                  ) : (
                     <div className="space-y-2">
                        {connectors.length ? (
                           connectors.map(connector => (
                              <Button
                                 key={connector.id}
                                 type="button"
                                 variant="ghost"
                                 onClick={() => void handleConnect(connector.id)}
                                 className="border-border/50 bg-background/60 hover:bg-accent/30 h-11 w-full justify-between rounded-xl border px-3"
                              >
                                 <span className="flex items-center gap-3">
                                    <span className="border-border/50 bg-muted text-muted-foreground grid size-9 place-items-center rounded-lg border text-xs font-semibold uppercase">
                                       {connector.name.slice(0, 1)}
                                    </span>
                                    <span className="text-foreground text-sm font-semibold">{connector.name}</span>
                                 </span>
                                 <span className="text-muted-foreground text-xs">Connect</span>
                              </Button>
                           ))
                        ) : (
                           <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-xl border border-dashed px-3 py-2 text-xs">
                              No wallets detected. Install a wallet extension to continue.
                           </div>
                        )}
                     </div>
                  )}
                  {error ? <p className="text-destructive text-xs font-semibold">{error}</p> : null}
               </CardContent>
            </Card>
         </PopoverContent>
      </Popover>
   );
}
