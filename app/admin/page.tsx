'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBalance } from '@solana/react-hooks';
import { Separator } from '@/components/ui/separator';
import { useFactoryActions } from '@/features/factory';
import { useFactoryAdmin } from '@/features/factory';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaucetAdminPanel } from '@/features/faucet/faucet-admin-panel';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';
const LAMPORTS_PER_SOL = 1_000_000_000;

function formatLamports(lamports?: bigint) {
   if (lamports === undefined) {
      return '—';
   }

   const sol = Number(lamports) / LAMPORTS_PER_SOL;

   if (!Number.isFinite(sol)) {
      return '—';
   }

   return sol.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function truncateAddress(address?: string | null) {
   if (!address) {
      return '—';
   }

   return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export default function Admin() {
   const { isAdmin, isConfigured, isLoading, adminAddress: adminAddressRaw, connectedAddress } = useFactoryAdmin();
   const { initialize, factoryConfig, pause, unpause, updateCreationFee, withdrawFees } = useFactoryActions();

   const factoryData = factoryConfig.data?.exists ? factoryConfig.data.data : null;
   const { lamports: treasuryLamports } = useBalance(factoryData?.treasuryAccount);
   const [creationFeeInput, setCreationFeeInput] = useState('');
   const lastSyncedFee = useRef<string | null>(null);

   const isInitialized = Boolean(factoryData);
   const isPaused = factoryData?.paused ?? false;

   const creationFeeSol = useMemo(() => {
      if (!factoryData) {
         return null;
      }

      return Number(factoryData.creationFeeLamports) / LAMPORTS_PER_SOL;
   }, [factoryData]);

   useEffect(() => {
      if (creationFeeSol === null) {
         return;
      }

      const nextValue = creationFeeSol.toString();

      setCreationFeeInput(current => {
         if (current === '' || current === lastSyncedFee.current) {
            return nextValue;
         }

         return current;
      });

      lastSyncedFee.current = nextValue;
   }, [creationFeeSol]);

   const parsedCreationFee = Number.parseFloat(creationFeeInput);
   const isCreationFeeValid = Number.isFinite(parsedCreationFee) && parsedCreationFee >= 0;
   const statusLabel = !isInitialized ? 'Uninitialized' : isPaused ? 'Paused' : 'Active';
   const statusBadgeVariant = !isInitialized ? 'outline' : isPaused ? 'destructive' : 'secondary';
   const treasuryAddress = truncateAddress(factoryData?.treasuryAccount?.toString());
   const adminAddress = truncateAddress(factoryData?.admin?.toString());
   const adminAddressShort = truncateAddress(adminAddressRaw);

   if (isLoading) {
      return (
         <div className="space-y-6">
            <Card className={cardShell}>
               <CardHeader>
                  <CardTitle>Admin console</CardTitle>
                  <CardDescription>Checking admin permissions...</CardDescription>
               </CardHeader>
            </Card>
         </div>
      );
   }

   if (!isAdmin) {
      return (
         <div className="space-y-6">
            <Card className={cardShell}>
               <CardHeader>
                  <CardTitle>Admin access required</CardTitle>
                  <CardDescription>Connect the factory admin wallet to continue.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="border-border/60 divide-border/60 divide-y overflow-hidden rounded-xl border">
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Factory status</span>
                        <span className="text-foreground font-semibold">
                           {isConfigured ? 'Initialized' : 'Not initialized'}
                        </span>
                     </div>
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Factory admin</span>
                        <span className="text-foreground font-semibold">{adminAddressShort}</span>
                     </div>
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Connected wallet</span>
                        <span className="text-foreground font-semibold">{truncateAddress(connectedAddress)}</span>
                     </div>
                  </div>
                  <p className="text-muted-foreground text-xs">
                     The admin console unlocks once you connect the configured factory admin wallet.
                  </p>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className={cardShell}>
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle>Factory controls</CardTitle>
                        <CardDescription>Manage initialization and pause state.</CardDescription>
                     </div>
                     <Badge variant="secondary">Admin only</Badge>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void initialize.mutateAsync()}
                        disabled={initialize.isPending || isInitialized}
                     >
                        {initialize.isPending ? 'Initializing...' : isInitialized ? 'Initialized' : 'Initialize'}
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => void pause.mutateAsync()}
                        disabled={!isInitialized || isPaused || pause.isPending}
                     >
                        {pause.isPending ? 'Pausing...' : 'Pause'}
                     </Button>
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void unpause.mutateAsync()}
                        disabled={!isInitialized || !isPaused || unpause.isPending}
                     >
                        {unpause.isPending ? 'Unpausing...' : 'Unpause'}
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => void withdrawFees.mutateAsync()}
                        disabled={!isInitialized || withdrawFees.isPending}
                     >
                        {withdrawFees.isPending ? 'Withdrawing...' : 'Withdraw fees'}
                     </Button>
                  </div>
                  <Separator />
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                     <div className="space-y-2">
                        <label className={labelClass}>Creation fee (SOL)</label>
                        <Input
                           type="number"
                           min={0}
                           step="0.01"
                           placeholder="0.1"
                           value={creationFeeInput}
                           onChange={event => setCreationFeeInput(event.target.value)}
                           disabled={!isInitialized || updateCreationFee.isPending}
                        />
                     </div>
                     <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={() => {
                           if (!isCreationFeeValid) {
                              return;
                           }

                           void updateCreationFee.mutateAsync(parsedCreationFee);
                        }}
                        disabled={!isInitialized || !isCreationFeeValid || updateCreationFee.isPending}
                     >
                        {updateCreationFee.isPending ? 'Updating...' : 'Update fee'}
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className={cardShell}>
               <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                     <div>
                        <CardTitle>Factory status</CardTitle>
                        <CardDescription>Latest on-chain configuration.</CardDescription>
                     </div>
                     <Badge variant={statusBadgeVariant}>{statusLabel}</Badge>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="border-border/60 divide-border/60 divide-y overflow-hidden rounded-xl border">
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Creation fee</span>
                        <span className="text-foreground font-semibold">
                           {formatLamports(factoryData?.creationFeeLamports)}
                        </span>
                     </div>
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Treasury</span>
                        <span className="text-foreground font-semibold">{treasuryAddress}</span>
                     </div>
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Treasury Balance</span>
                        <span className="text-foreground font-semibold">{formatLamports(treasuryLamports || 0n)}</span>
                     </div>
                     <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-muted-foreground">Admin</span>
                        <span className="text-foreground font-semibold">{adminAddress}</span>
                     </div>
                  </div>
                  <p className="text-muted-foreground text-xs">
                     Connect an admin wallet to update the factory configuration.
                  </p>
               </CardContent>
            </Card>
         </div>

         <FaucetAdminPanel />
      </div>
   );
}
