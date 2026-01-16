'use client';

import copy from 'copy-to-clipboard';
import { useCallback, useState } from 'react';
import { useBalance, useConnectWallet, useDisconnectWallet, useWallet, useWalletConnection } from '@solana/react-hooks';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   ConnectDialogContent,
   ConnectedWalletContent,
   NetworkSelectorDialog,
   type WalletConnector,
   WalletTriggerButton,
} from '@/features/wallet/components/connect';
import { formatAddress, formatSolBalance } from '@/features/wallet/lib';
import { useWalletNetwork } from '@/features/wallet/hooks';
import { SOLANA_NETWORKS, type SolanaNetworkId } from '@/features/wallet/lib/networks';
import { useQueryClient } from '@tanstack/react-query';

const COPY_RESET_MS = 1500;
const MENU_ID = 'wallet-menu';

export function ConnectButton() {
   const wallet = useWallet();
   const queryClient = useQueryClient();
   const { connectors, isReady } = useWalletConnection();
   const connectWallet = useConnectWallet();
   const disconnectWallet = useDisconnectWallet();
   const { selectedNetwork, switchNetwork } = useWalletNetwork();
   const [error, setError] = useState<string | null>(null);
   const [open, setOpen] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [copied, setCopied] = useState(false);
   const [connectingId, setConnectingId] = useState<string | null>(null);
   const [networkDialogOpen, setNetworkDialogOpen] = useState(false);

   const isConnected = wallet.status === 'connected';
   const address = isConnected ? wallet.session.account.address.toString() : null;
   const { lamports, fetching: balanceFetching } = useBalance(address ?? undefined, { watch: true });

   const isConnecting = wallet.status === 'connecting' || connectingId !== null;
   const connectionLabel = isConnected
      ? formatAddress(address ?? '')
      : isConnecting
        ? 'Connecting...'
        : 'Connect wallet';
   const expanded = isConnected ? open : dialogOpen;
   const activeConnectingId = wallet.status === 'connecting' ? wallet.connectorId : connectingId;
   const balanceLabel = formatSolBalance(lamports);

   const handleDialogOpenChange = useCallback((next: boolean) => {
      setDialogOpen(next);
      if (next) {
         setError(null);
      }
   }, []);

   const handlePopoverOpenChange = useCallback((next: boolean) => {
      setOpen(next);
      if (next) {
         setError(null);
         setCopied(false);
      }
   }, []);

   const handleError = useCallback((err: unknown, fallback: string) => {
      if (err instanceof Error) {
         setError(err.message);
         return;
      }
      if (typeof err === 'string' && err.trim().length > 0) {
         setError(err);
         return;
      }
      setError(fallback);
   }, []);

   async function handleConnect(connectorId: string) {
      setError(null);
      setConnectingId(connectorId);
      try {
         await connectWallet(connectorId, { autoConnect: true });
         setOpen(false);
         setDialogOpen(false);
      } catch (err) {
         handleError(err, 'Unable to connect');
      } finally {
         setConnectingId(null);
      }
   }

   async function handleDisconnect() {
      setError(null);
      try {
         await disconnectWallet();
         setOpen(false);
      } catch (err) {
         handleError(err, 'Unable to disconnect');
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
         handleError(err, 'Unable to copy address');
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

   async function handleNetworkSelect(networkId: SolanaNetworkId) {
      setError(null);
      try {
         await switchNetwork(networkId);
         setNetworkDialogOpen(false);
         queryClient.clear(); // Clear cached queries to refetch data for the new network
      } catch (err) {
         handleError(err, 'Unable to switch network');
      }
   }

   const triggerButton = (
      <WalletTriggerButton
         expanded={expanded}
         controlsId={isConnected ? MENU_ID : undefined}
         isConnected={isConnected}
         connectionLabel={connectionLabel}
         isConnecting={isConnecting}
      />
   );

   return (
      <>
         <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            {!isConnected ? <DialogTrigger asChild>{triggerButton}</DialogTrigger> : null}
            <DialogContent className="border-border/60 bg-background/95 rounded-2xl p-0 shadow-2xl sm:max-w-md">
               <ConnectDialogContent
                  connectors={connectors as readonly WalletConnector[]}
                  onConnect={connectorId => void handleConnect(connectorId)}
                  error={error}
                  connectingId={activeConnectingId}
                  isReady={isReady}
               />
            </DialogContent>
         </Dialog>
         {isConnected ? (
            <Popover open={open} onOpenChange={handlePopoverOpenChange}>
               <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
               <PopoverContent
                  id={MENU_ID}
                  align="start"
                  sideOffset={12}
                  className="border-border/60 bg-background/95 w-[320px] rounded-2xl p-4 shadow-2xl backdrop-blur"
               >
                  <ConnectedWalletContent
                     address={address ?? ''}
                     copied={copied}
                     onCopy={() => void handleCopy()}
                     onDisconnect={() => void handleDisconnect()}
                     error={error}
                     network={selectedNetwork}
                     onChangeNetwork={handleRequestChangeNetwork}
                     onChangeWallet={handleRequestChangeWallet}
                     balance={balanceLabel}
                     balanceLoading={balanceFetching}
                  />
               </PopoverContent>
            </Popover>
         ) : null}
         <NetworkSelectorDialog
            open={networkDialogOpen}
            onOpenChange={setNetworkDialogOpen}
            selectedNetworkId={selectedNetwork.id}
            onSelectNetwork={handleNetworkSelect}
            networks={SOLANA_NETWORKS}
         />
      </>
   );
}
