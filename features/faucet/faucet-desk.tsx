'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useCopyClipboard } from '@/hooks/use-copy-clipboard';
import { formatAddress, useWalletNetwork, useWalletSigner } from '@/features/wallet';
import { ConnectButton } from '@/features/wallet/components/connect-button';
import { useFaucetActions } from './hooks/use-faucet-actions';

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

function formatDuration(seconds: number | null) {
   if (seconds === null) {
      return '-';
   }

   if (seconds <= 0) {
      return 'None';
   }

   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const secs = Math.floor(seconds % 60);

   if (hours > 0) {
      return `${hours}h ${minutes}m`;
   }

   if (minutes > 0) {
      return `${minutes}m`;
   }

   return `${secs}s`;
}

function formatTokenAmount(amount: bigint | null, decimals: number | null) {
   if (amount === null) {
      return '-';
   }

   if (decimals === null || decimals <= 0) {
      return amount.toString();
   }

   const base = 10n ** BigInt(decimals);
   const whole = amount / base;
   const fraction = amount % base;
   const fractionLabel = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');

   return fractionLabel ? `${whole.toString()}.${fractionLabel}` : whole.toString();
}

export function FaucetDesk() {
   const { claim, faucetConfig, recipientData, mintInfo } = useFaucetActions();
   const signer = useWalletSigner();
   const { selectedNetwork } = useWalletNetwork();
   const { copied: mintCopied, copyText: copyMint } = useCopyClipboard();
   const walletAddress = signer?.address?.toString() ?? '';

   const configData = faucetConfig.data?.exists ? faucetConfig.data.data : null;
   const cooldownSeconds = configData ? Number(configData.cooldownSeconds) : null;
   const mintAddress = configData?.mint?.toString() ?? '';
   const tokenDecimals = typeof mintInfo.data?.decimals === 'number' ? mintInfo.data.decimals : null;

   const hasWallet = Boolean(walletAddress);
   const isInitialized = Boolean(configData);
   const isMintLoading = mintInfo.isLoading || mintInfo.isFetching;

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

   const claimAmountLabel = configData
      ? isMintLoading || tokenDecimals === null
         ? 'Loading...'
         : formatTokenAmount(configData.allowedClaimAmount, tokenDecimals)
      : '-';

   const totalClaimedLabel = configData
      ? isMintLoading || tokenDecimals === null
         ? 'Loading...'
         : formatTokenAmount(configData.totalClaimedAmount, tokenDecimals)
      : '-';

   const totalClaimsLabel = configData ? configData.totalClaims.toString() : '-';
   const cooldownLabel = formatDuration(cooldownSeconds);
   const mintLabel = mintAddress ? formatAddress(mintAddress, 6) : '-';
   const mintCopyLabel = mintCopied ? 'Copied' : 'Copy';

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
               <div className="mx-auto w-full max-w-xl rounded-2xl border border-[color:var(--border-low)] bg-[color:var(--card)]/70 p-5 text-left shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                     <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                        Faucet info
                     </p>
                     <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase ${
                           isInitialized
                              ? 'border-emerald-400/40 text-emerald-300'
                              : 'border-amber-400/40 text-amber-300'
                        }`}
                     >
                        {isInitialized ? 'Online' : 'Offline'}
                     </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                     <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                           Mint address
                        </p>
                        <div className="flex items-center gap-2">
                           <span
                              className="truncate font-mono text-sm text-[color:var(--foreground)]"
                              title={mintAddress || 'Not set'}
                           >
                              {mintLabel}
                           </span>
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-3 text-[11px] tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase"
                              onClick={() => copyMint(mintAddress)}
                              disabled={!mintAddress}
                           >
                              {mintCopyLabel}
                           </Button>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                           Claim amount
                        </p>
                        <p className="text-lg font-semibold text-[color:var(--foreground)]">{claimAmountLabel}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                           Cooldown
                        </p>
                        <p className="text-sm text-[color:var(--foreground)]">{cooldownLabel}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                           Total claimed
                        </p>
                        <p className="text-sm text-[color:var(--foreground)]">{totalClaimedLabel}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                           Total claims
                        </p>
                        <p className="text-sm text-[color:var(--foreground)]">{totalClaimsLabel}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.2em] text-[color:var(--muted-foreground)] uppercase">
                           Network
                        </p>
                        <p className="text-sm text-[color:var(--foreground)]">{selectedNetwork.label}</p>
                     </div>
                  </div>
               </div>
               <p className="text-sm text-[color:var(--muted-foreground)/80]">
                  {walletStatusLabel} · Next claim {nextClaimLabel}
               </p>
            </div>
         </Card>
      </div>
   );
}
