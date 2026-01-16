'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useWalletSigner } from '@/features/wallet';
import { useFaucetActions } from './hooks/use-faucet-actions';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

export function FaucetAdminPanel() {
   const { initialize, deposit, withdraw, faucetConfig } = useFaucetActions();
   const configData = faucetConfig.data?.exists ? faucetConfig.data.data : null;
   const isInitialized = Boolean(configData);
   const signer = useWalletSigner();
   const hasWallet = Boolean(signer?.address);

   const [mintAddressInput, setMintAddressInput] = useState('');
   const [adminAmountInput, setAdminAmountInput] = useState('');
   const lastSyncedMint = useRef<string | null>(null);

   useEffect(() => {
      if (!configData?.mint) {
         if (lastSyncedMint.current !== null) {
            lastSyncedMint.current = null;
            setMintAddressInput('');
         }

         return;
      }

      const nextValue = configData.mint.toString();
      setMintAddressInput(current => {
         if (current === '' || current === lastSyncedMint.current) {
            return nextValue;
         }
         return current;
      });

      lastSyncedMint.current = nextValue;
   }, [configData?.mint]);

   const hasMintAddress = Boolean(mintAddressInput.trim());
   const parsedAdminAmount = Number.parseFloat(adminAmountInput);
   const isAmountValid = Number.isFinite(parsedAdminAmount) && parsedAdminAmount > 0;

   const depositLabel = deposit.isPending ? 'Depositing...' : 'Deposit';
   const withdrawLabel = withdraw.isPending ? 'Withdrawing...' : 'Withdraw';
   const initializeLabel = initialize.isPending ? 'Initializing...' : isInitialized ? 'Initialized' : 'Initialize';

   return (
      <Card className={cardShell}>
         <CardHeader>
            <div className="flex items-center justify-between gap-4">
               <div>
                  <CardTitle>Faucet admin</CardTitle>
                  <CardDescription>Seed supply and restore authorities for the faucet.</CardDescription>
               </div>
               <Badge variant="secondary">Admin only</Badge>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            <div className="space-y-2">
               <label className={labelClass}>Mint address</label>
               <Input
                  placeholder="0x..."
                  value={mintAddressInput}
                  onChange={event => setMintAddressInput(event.target.value)}
                  disabled={isInitialized}
               />
            </div>

            <div className="space-y-2">
               <label className={labelClass}>Amount</label>
               <Input
                  type="number"
                  min={0}
                  placeholder="0.1"
                  value={adminAmountInput}
                  onChange={event => setAdminAmountInput(event.target.value)}
               />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
               <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void initialize.mutateAsync({ mint: mintAddressInput })}
                  disabled={!hasWallet || !hasMintAddress || isInitialized || initialize.isPending}
               >
                  {initializeLabel}
               </Button>

               <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void deposit.mutateAsync({ amount: adminAmountInput })}
                  disabled={!hasWallet || !isInitialized || !hasMintAddress || !isAmountValid || deposit.isPending}
               >
                  {depositLabel}
               </Button>

               <Button
                  type="button"
                  variant="outline"
                  onClick={() => void withdraw.mutateAsync({ amount: adminAmountInput })}
                  disabled={!hasWallet || !isInitialized || !hasMintAddress || !isAmountValid || withdraw.isPending}
               >
                  {withdrawLabel}
               </Button>
            </div>

            <Separator />
            <p className="text-muted-foreground text-xs">
               Use these controls to keep the faucet funded or rotate authorities as needed.
            </p>
         </CardContent>
      </Card>
   );
}
