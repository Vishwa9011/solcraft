'use client';

import { useMemo, useState } from 'react';
import { useConnectWallet, useDisconnectWallet, useWallet, useWalletConnection } from '@solana/react-hooks';
import copy from 'copy-to-clipboard';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   ConnectDialogContent,
   ConnectedWalletContent,
   NetworkSelectorDialog,
   type WalletConnector,
   WalletTriggerButton,
} from '@/features/wallet/components/connect';
import { DEFAULT_SOLANA_NETWORK, SOLANA_NETWORKS, type SolanaNetworkId } from '@/lib/solana/networks';

const COPY_RESET_MS = 1500;
const MENU_ID = 'wallet-menu';

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
   const [networkDialogOpen, setNetworkDialogOpen] = useState(false);
   const [selectedNetworkId, setSelectedNetworkId] = useState<SolanaNetworkId>(DEFAULT_SOLANA_NETWORK.id);

   const isConnected = wallet.status === 'connected';
   const address = isConnected ? wallet.session.account.address.toString() : null;

   const selectedNetwork = useMemo(
      () => SOLANA_NETWORKS.find(network => network.id === selectedNetworkId) ?? DEFAULT_SOLANA_NETWORK,
      [selectedNetworkId]
   );

   const connectionLabel = address ? truncate(address) : 'Connect wallet';
   const displayAddress = address ? truncate(address) : '';
   const expanded = isConnected ? open : dialogOpen;

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

   function handleRequestChangeWallet() {
      setOpen(false);
      setDialogOpen(true);
   }

   function handleRequestChangeNetwork() {
      setOpen(false);
      setNetworkDialogOpen(true);
   }

   function handleNetworkSelect(networkId: SolanaNetworkId) {
      setSelectedNetworkId(networkId);
      setNetworkDialogOpen(false);
   }

   const triggerButton = (
      <WalletTriggerButton
         expanded={expanded}
         controlsId={isConnected ? MENU_ID : undefined}
         isConnected={isConnected}
         connectionLabel={connectionLabel}
      />
   );

   return (
      <>
         <Dialog
            open={dialogOpen}
            onOpenChange={next => {
               setDialogOpen(next);
               if (next) {
                  setError(null);
               }
            }}
         >
            {!isConnected ? <DialogTrigger asChild>{triggerButton}</DialogTrigger> : null}
            <DialogContent className="border-border/60 bg-popover/95 p-0 shadow-2xl sm:max-w-md">
               <ConnectDialogContent
                  connectors={connectors as readonly WalletConnector[]}
                  onConnect={connectorId => void handleConnect(connectorId)}
                  error={error}
               />
            </DialogContent>
         </Dialog>
         {isConnected ? (
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
               <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
               <PopoverContent
                  id={MENU_ID}
                  align="start"
                  sideOffset={12}
                  className="border-border/60 bg-background/90 w-[320px] p-4 shadow-2xl backdrop-blur"
               >
                  <ConnectedWalletContent
                     address={address ?? ''}
                     displayAddress={displayAddress}
                     copied={copied}
                     onCopy={() => void handleCopy()}
                     onDisconnect={() => void handleDisconnect()}
                     error={error}
                     network={selectedNetwork}
                     onChangeNetwork={handleRequestChangeNetwork}
                     onChangeWallet={handleRequestChangeWallet}
                  />
               </PopoverContent>
            </Popover>
         ) : null}
         <NetworkSelectorDialog
            open={networkDialogOpen}
            onOpenChange={setNetworkDialogOpen}
            selectedNetworkId={selectedNetworkId}
            onSelectNetwork={handleNetworkSelect}
            networks={SOLANA_NETWORKS}
         />
      </>
   );
}
