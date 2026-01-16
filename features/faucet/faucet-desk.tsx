'use client';

import { Button } from '@/components/ui/button';
import { useWalletSigner } from '@/features/wallet';
import { useFaucetActions } from './hooks/use-faucet-actions';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ConnectButton } from '@/features/wallet/components/connect-button';

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

export function FaucetDesk() {
   const { claim, faucetConfig, recipientData } = useFaucetActions();
   const signer = useWalletSigner();
   const walletAddress = signer?.address?.toString() ?? '';

   const configData = faucetConfig.data?.exists ? faucetConfig.data.data : null;
   const cooldownSeconds = configData ? Number(configData.cooldownSeconds) : null;

   const hasWallet = Boolean(walletAddress);
   const isInitialized = Boolean(configData);

   const recipientLastClaimedAt = recipientData.data?.exists ? Number(recipientData.data.data.lastClaimedAt) : 0;

   const remainingCooldownSeconds =
      !hasWallet || !isInitialized || cooldownSeconds === null
         ? null
         : recipientLastClaimedAt
           ? Math.max(0, recipientLastClaimedAt + cooldownSeconds - Math.floor(Date.now() / 1000))
           : 0;

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

   return (
      <div className="flex w-full items-center justify-center">
         <Card className="relative w-full max-w-2xl overflow-hidden rounded-[34px] border border-[color:var(--border-low)] bg-[color:var(--card)]/90 shadow-[0_25px_35px_rgba(0,0,0,0.55)] backdrop-blur-3xl">
            <div className="relative z-10 space-y-6 px-6 py-10 text-center text-[color:var(--foreground)] md:px-12">
               <CardTitle className="text-4xl leading-tight font-semibold text-[color:var(--color-foreground)]">
                  Claim faucet
               </CardTitle>
               <CardDescription className="text-base leading-relaxed text-[color:var(--muted-foreground)]">
                  Connect your wallet, tap claim, and receive your free tokens—no distractions, just the action.
               </CardDescription>
               <div className="flex justify-center">
                  {hasWallet ? (
                     <Button
                        type="button"
                        variant="default"
                        size="lg"
                        className="mt-4 w-full max-w-sm rounded-[28px] border border-[color:var(--border-strong)] bg-[color:var(--card)] px-8 py-4 text-lg font-semibold tracking-wide text-[color:var(--foreground)] shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition hover:border-[color:var(--primary)]"
                        onClick={() => void claim.mutateAsync()}
                        disabled={!canClaim || claim.isPending}
                     >
                        {claimLabel}
                     </Button>
                  ) : (
                     <div className="mt-4 w-full max-w-sm">
                        <ConnectButton />
                     </div>
                  )}
               </div>
               <p className="text-sm text-[color:var(--muted-foreground)/80]">
                  {walletStatusLabel} · Next claim {nextClaimLabel}
               </p>
            </div>
         </Card>
      </div>
   );
}
