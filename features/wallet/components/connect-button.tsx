'use client';

import { useState } from 'react';
import { lamportsToSolString } from '@solana/client';
import { useBalance, useConnectWallet, useDisconnectWallet, useWallet, useWalletConnection } from '@solana/react-hooks';
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
import { useWalletNetwork } from '@/features/wallet/hooks';
import { SOLANA_NETWORKS, type SolanaNetworkId } from '@/lib/solana/networks';

const COPY_RESET_MS = 1500;
const MENU_ID = 'wallet-menu';

function truncate(address: string) {
   return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function ConnectButton() {
   const wallet = useWallet();
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
   const connectedConnector = isConnected ? wallet.session.connector : null;

   const isConnecting = wallet.status === 'connecting' || connectingId !== null;
   const connectionLabel = isConnected ? truncate(address ?? '') : isConnecting ? 'Connecting...' : 'Connect wallet';
   const displayAddress = address ? truncate(address) : '';
   const expanded = isConnected ? open : dialogOpen;
   const activeConnectingId = wallet.status === 'connecting' ? wallet.connectorId : connectingId;
   const balanceLabel =
      lamports !== null ? lamportsToSolString(lamports, { minimumFractionDigits: 2, trimTrailingZeros: true }) : null;

   async function handleConnect(connectorId: string) {
      setError(null);
      setConnectingId(connectorId);
      try {
         await connectWallet(connectorId, { autoConnect: true });
         setOpen(false);
         setDialogOpen(false);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to connect');
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

   async function handleNetworkSelect(networkId: SolanaNetworkId) {
      setError(null);
      try {
         await switchNetwork(networkId);
         setNetworkDialogOpen(false);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to switch network');
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
                  className="border-border/60 bg-background/95 w-[320px] rounded-2xl p-4 shadow-2xl backdrop-blur"
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
                     walletIcon={connectedConnector?.icon ?? null}
                     walletName={connectedConnector?.name ?? null}
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
