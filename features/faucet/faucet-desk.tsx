'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useWalletSigner } from '@/features/wallet';
import { cn } from '@/lib/utils';
import { Droplet, Timer, Wallet } from 'lucide-react';
import { useFaucetActions } from './hooks/use-faucet-actions';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

function formatTokenAmount(amount: bigint | null | undefined, decimals: number | null | undefined) {
   if (amount === null || amount === undefined) {
      return '-';
   }

   if (decimals === null || decimals === undefined) {
      return amount.toString();
   }

   if (decimals === 0) {
      return amount.toString();
   }

   const raw = amount.toString().padStart(decimals + 1, '0');
   const whole = raw.slice(0, -decimals);
   const fraction = raw.slice(-decimals).replace(/0+$/, '');

   return fraction ? `${whole}.${fraction}` : whole;
}

function formatCooldown(seconds: number | null) {
   if (!seconds || !Number.isFinite(seconds)) {
      return '-';
   }

   const hours = Math.floor(seconds / 3600);
   if (hours >= 24 && hours % 24 === 0) {
      return `${hours / 24}d`;
   }
   if (hours > 0) {
      return `${hours}h`;
   }

   const minutes = Math.floor(seconds / 60);
   if (minutes > 0) {
      return `${minutes}m`;
   }

   return `${seconds}s`;
}

function formatRemaining(seconds: number | null) {
   if (seconds === null) {
      return '-';
   }

   if (seconds <= 0) {
      return 'Ready now';
   }

   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);

   if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
   }

   if (minutes > 0) {
      return `in ${minutes}m`;
   }

   return 'in under 1m';
}

function formatTimestamp(seconds: number | null) {
   if (!seconds) {
      return '-';
   }

   return new Date(seconds * 1000).toLocaleString();
}

export function FaucetDesk() {
   const { claim, deposit, initialize, withdraw, faucetConfig, recipientData, mintInfo } = useFaucetActions();
   const signer = useWalletSigner();
   const walletAddress = signer?.address?.toString() ?? '';

   const [mintAddressInput, setMintAddressInput] = useState('');
   const [adminAmountInput, setAdminAmountInput] = useState('');
   const lastSyncedMint = useRef<string | null>(null);

   const configData = faucetConfig.data?.exists ? faucetConfig.data.data : null;
   const mintDecimals = mintInfo.data?.data.decimals ?? null;
   const allowedClaimAmount = formatTokenAmount(configData?.allowedClaimAmount ?? null, mintDecimals);
   const cooldownSeconds = configData ? Number(configData.cooldownSeconds) : null;

   useEffect(() => {
      if (!configData?.mint) {
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
   const hasWallet = Boolean(walletAddress);
   const isInitialized = Boolean(configData);
   const parsedAdminAmount = Number.parseFloat(adminAmountInput);
   const isAmountValid = Number.isFinite(parsedAdminAmount) && parsedAdminAmount > 0;

   const recipientLastClaimedAt = useMemo(() => {
      if (!recipientData.data?.exists) {
         return 0;
      }

      return Number(recipientData.data.data.lastClaimedAt);
   }, [recipientData.data]);

   const remainingCooldownSeconds = useMemo(() => {
      if (!hasWallet || !isInitialized || cooldownSeconds === null) {
         return null;
      }

      if (!recipientLastClaimedAt) {
         return 0;
      }

      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, recipientLastClaimedAt + cooldownSeconds - now);
   }, [cooldownSeconds, hasWallet, isInitialized, recipientLastClaimedAt]);

   const canClaim = hasWallet && isInitialized && remainingCooldownSeconds !== null && remainingCooldownSeconds <= 0;
   const claimLabel = claim.isPending ? 'Claiming...' : 'Claim free tokens';
   const nextClaimLabel = hasWallet
      ? isInitialized
         ? formatRemaining(remainingCooldownSeconds)
         : 'Faucet offline'
      : 'Connect wallet';
   const walletStatusLabel = hasWallet
      ? isInitialized
         ? remainingCooldownSeconds && remainingCooldownSeconds > 0
            ? 'Cooldown'
            : 'Eligible'
         : 'Unavailable'
      : 'Connect wallet';
   const lastClaimLabel = recipientLastClaimedAt ? formatTimestamp(recipientLastClaimedAt) : '-';

   return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
         <Card className={cardShell}>
            <CardHeader>
               <CardTitle>Free Mint Faucet</CardTitle>
               <CardDescription>Let users claim limited tokens on a cooldown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
               <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Limit {allowedClaimAmount} tokens</Badge>
                  <Badge variant="secondary">Cooldown {formatCooldown(cooldownSeconds)}</Badge>
                  <Badge variant="secondary">{isInitialized ? 'Faucet ready' : 'Needs setup'}</Badge>
               </div>
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <label className={labelClass}>Mint address</label>
                     <Input
                        placeholder="Mint public key"
                        value={mintAddressInput}
                        onChange={event => setMintAddressInput(event.target.value)}
                        disabled={isInitialized}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className={labelClass}>Recipient</label>
                     <Input placeholder="Connect wallet" value={walletAddress} disabled />
                  </div>
               </div>
               <Button
                  type="button"
                  className="w-full"
                  onClick={() => void claim.mutateAsync()}
                  disabled={!canClaim || claim.isPending}
               >
                  {claimLabel}
               </Button>
               <p className="text-muted-foreground text-xs">Claiming is subject to cooldown and per-wallet limits.</p>
               <Separator />
               <div className="space-y-3">
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Admin actions</p>
                  <Input
                     placeholder="Mint address"
                     value={mintAddressInput}
                     onChange={event => setMintAddressInput(event.target.value)}
                     disabled={isInitialized}
                  />
                  <Input
                     type="number"
                     min={0}
                     placeholder="Amount"
                     value={adminAmountInput}
                     onChange={event => setAdminAmountInput(event.target.value)}
                  />
                  <div className="grid gap-2 sm:grid-cols-3">
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void initialize.mutateAsync({ mint: mintAddressInput })}
                        disabled={!hasWallet || !hasMintAddress || isInitialized || initialize.isPending}
                     >
                        {initialize.isPending ? 'Initializing...' : 'Initialize'}
                     </Button>
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void deposit.mutateAsync({ amount: adminAmountInput })}
                        disabled={!isInitialized || !hasWallet || !isAmountValid || deposit.isPending}
                     >
                        {deposit.isPending ? 'Depositing...' : 'Deposit'}
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => void withdraw.mutateAsync({ amount: adminAmountInput })}
                        disabled={!isInitialized || !hasWallet || !isAmountValid || withdraw.isPending}
                     >
                        {withdraw.isPending ? 'Withdrawing...' : 'Withdraw'}
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="space-y-8">
            <Card className={cardShell}>
               <CardHeader>
                  <CardTitle>Claim status</CardTitle>
                  <CardDescription>Latest faucet activity for this wallet.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center gap-2">
                        <Timer className="size-4" />
                        Next claim
                     </span>
                     <span className="text-foreground font-semibold">{nextClaimLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center gap-2">
                        <Wallet className="size-4" />
                        Wallet status
                     </span>
                     <span className="text-foreground font-semibold">{walletStatusLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center gap-2">
                        <Droplet className="size-4" />
                        Last claim
                     </span>
                     <span className="text-foreground font-semibold">{lastClaimLabel}</span>
                  </div>
               </CardContent>
            </Card>

            <Card className={cn(cardShell, 'border-dashed')}>
               <CardHeader>
                  <CardTitle>Faucet guardrails</CardTitle>
                  <CardDescription>Protecting supply from abuse.</CardDescription>
               </CardHeader>
               <CardContent className="text-muted-foreground space-y-3 text-sm">
                  <p>Cooldown and per-wallet limits are enforced on-chain.</p>
                  <p>Use the admin actions to replenish treasury safely.</p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
