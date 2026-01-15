'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBalance } from '@solana/react-hooks';
import { Separator } from '@/components/ui/separator';
import { useFactoryActions } from '@/features/factory';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
   const { initialize, factoryConfig, pause, unpause, updateCreationFee, withdrawFees } = useFactoryActions();

   const { lamports: treasuryLamports } = useBalance(
      factoryConfig.data?.exists ? factoryConfig.data.data.treasuryAccount : undefined
   );
   console.log('treasuryLamports: ', treasuryLamports);
   const [creationFeeInput, setCreationFeeInput] = useState('');
   const lastSyncedFee = useRef<string | null>(null);

   const configData = factoryConfig.data?.exists ? factoryConfig.data.data : null;
   const isInitialized = Boolean(factoryConfig.data?.exists);
   const isPaused = configData?.paused ?? false;

   const creationFeeSol = useMemo(() => {
      if (!configData) {
         return null;
      }

      return Number(configData.creationFeeLamports) / LAMPORTS_PER_SOL;
   }, [configData]);

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
   const treasuryAddress = truncateAddress(configData?.treasuryAccount?.toString());
   const adminAddress = truncateAddress(configData?.admin?.toString());

   return (
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
            <CardContent className="space-y-4">
               <div className="grid gap-2 sm:grid-cols-2">
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
                  <Button
                     type="button"
                     className="w-full"
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
               <CardTitle>Factory status</CardTitle>
               <CardDescription>Latest on-chain configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-foreground font-semibold">{statusLabel}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Creation fee</span>
                  <span className="text-foreground font-semibold">
                     {formatLamports(configData?.creationFeeLamports)}
                  </span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Treasury</span>
                  <span className="text-foreground font-semibold">{treasuryAddress}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Treasury Balance</span>
                  <span className="text-foreground font-semibold">{formatLamports(treasuryLamports || 0n)}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Admin</span>
                  <span className="text-foreground font-semibold">{adminAddress}</span>
               </div>
               <Separator />
               <p className="text-muted-foreground text-xs">
                  Connect an admin wallet to update the factory configuration.
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
