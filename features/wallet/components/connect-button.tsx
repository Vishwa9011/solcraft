'use client';

import { useState } from 'react';
import { useConnectWallet, useDisconnectWallet, useWallet, useWalletConnection } from '@solana/react-hooks';
import copy from 'copy-to-clipboard';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   ConnectDialogContent,
   ConnectedWalletContent,
   type WalletConnector,
   WalletTriggerButton,
} from '@/features/wallet/components/connect';

const COPY_RESET_MS = 1500;

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
   const [dialogOpen, setDialogOpen] = useState(false);
   const [copied, setCopied] = useState(false);

   const isConnected = wallet.status === 'connected';
   const address = isConnected ? wallet.session.account.address.toString() : null;

   async function handleConnect(connectorId: string) {
      setError(null);
      try {
         await connectWallet(connectorId, { autoConnect: true });
         setOpen(false);
         setDialogOpen(false);
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

   async function handleCopy() {
      if (!address) return;
      try {
         const didCopy = copy(address);
         if (!didCopy) {
            throw new Error('Copy failed');
         }
         setCopied(true);
         window.setTimeout(() => setCopied(false), COPY_RESET_MS);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to copy address');
      }
   }

   const menuId = 'wallet-menu';
   const connectionLabel = address ? truncate(address) : 'Connect wallet';
   const displayAddress = address ? truncate(address) : '';

   if (!isConnected) {
      return (
         <Dialog
            open={dialogOpen}
            onOpenChange={next => {
               setDialogOpen(next);
               if (next) {
                  setError(null);
               }
            }}
         >
            <DialogTrigger asChild>
               <WalletTriggerButton expanded={dialogOpen} isConnected={false} connectionLabel={connectionLabel} />
            </DialogTrigger>
            <DialogContent className="border-border/60 bg-popover/95 p-0 shadow-xl sm:max-w-md">
               <ConnectDialogContent
                  connectors={connectors as WalletConnector[]}
                  onConnect={(connectorId: string) => void handleConnect(connectorId)}
                  error={error}
               />
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Popover
         open={open}
         onOpenChange={next => {
            setOpen(next);
            if (next) {
               setError(null);
               setCopied(false);
            }
         }}
      >
         <PopoverTrigger asChild>
            <WalletTriggerButton expanded={open} controlsId={menuId} isConnected connectionLabel={connectionLabel} />
         </PopoverTrigger>
         <PopoverContent
            id={menuId}
            align="start"
            sideOffset={12}
            className="border-border/60 bg-popover/90 w-[260px] p-3 shadow-xl backdrop-blur"
         >
            <ConnectedWalletContent
               address={address ?? ''}
               displayAddress={displayAddress}
               copied={copied}
               onCopy={() => void handleCopy()}
               onDisconnect={() => void handleDisconnect()}
               error={error}
            />
         </PopoverContent>
      </Popover>
   );
}
