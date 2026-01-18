'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useCopyClipboard } from '@/hooks/use-copy-clipboard';
import { ConnectButton } from '@/features/wallet/components/connect-button';
import { InfoRow, InfoTile } from './components/faucet-desk-info';
import { useFaucetDeskState } from './hooks/use-faucet-desk-state';
import { Check, Copy } from 'lucide-react';

export function FaucetDesk() {
   const {
      hasWallet,
      isInitialized,
      canClaim,
      claimLabel,
      claimAmountLabel,
      mintAddress,
      mintLabel,
      cooldownLabel,
      summaryLabel,
      eligibilityLabel,
      nextClaimLabel,
      onClaim,
   } = useFaucetDeskState();
   const { copied: mintCopied, copyText: copyMint } = useCopyClipboard();
   const showSummary = hasWallet;
   const showDetails = hasWallet && isInitialized;

   return (
      <div className="flex w-full items-center justify-center">
         <Card className="border-border-low relative w-full max-w-2xl overflow-hidden rounded-[34px] border bg-gradient-to-br from-amber-500/10 via-card/90 to-emerald-500/10 shadow-[0_25px_35px_rgba(0,0,0,0.55)] backdrop-blur-3xl">
            <div className="text-foreground relative z-10 space-y-6 px-6 py-10 text-center md:px-12">
               <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                     <CardTitle className="text-foreground text-4xl leading-tight font-semibold">Faucet</CardTitle>
                     {showDetails ? (
                        <span
                           className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase ${
                              isInitialized
                                 ? 'border-emerald-400/40 text-emerald-300'
                                 : 'border-amber-400/40 text-amber-300'
                           }`}
                        >
                           {isInitialized ? 'Online' : 'Offline'}
                        </span>
                     ) : null}
                  </div>
                  {showSummary ? (
                     <CardDescription className="text-muted-foreground text-base leading-relaxed">
                        {summaryLabel}
                     </CardDescription>
                  ) : null}
               </div>
               {showDetails ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                     <InfoTile label="Claim amount" value={claimAmountLabel} />
                     <InfoTile label="Cooldown" value={cooldownLabel} />
                  </div>
               ) : null}
               <div className="flex justify-center">
                  {!hasWallet ? (
                     <div className="mt-4 w-full max-w-sm">
                        <ConnectButton />
                     </div>
                  ) : isInitialized ? (
                     <Button
                        type="button"
                        variant="default"
                        size="lg"
                        className="border-border-strong bg-card text-foreground hover:border-primary mt-4 w-full max-w-sm rounded-[28px] border px-8 py-4 text-lg font-semibold tracking-wide shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition"
                        onClick={onClaim}
                        disabled={!canClaim}
                     >
                        {claimLabel}
                     </Button>
                  ) : null}
               </div>
               {showDetails ? (
                  <div className="border-border-low bg-card/70 mx-auto w-full max-w-xl space-y-3 rounded-2xl border p-5 text-left shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur">
                     <InfoRow
                        label="Token mint"
                        value={
                           <div className="flex min-w-0 items-center gap-2">
                              <span
                                 className="text-foreground truncate font-mono text-sm"
                                 title={mintAddress || 'Not set'}
                              >
                                 {mintLabel}
                              </span>
                              <Button
                                 type="button"
                                 variant="ghost"
                                 size="icon-sm"
                                 className="border-border/60 size-7 rounded-full border p-0"
                                 onClick={() => copyMint(mintAddress)}
                                 aria-label="Copy token mint address"
                                 disabled={!mintAddress}
                              >
                                 {mintCopied ? (
                                    <Check className="size-3 text-emerald-400" />
                                 ) : (
                                    <Copy className="size-3" />
                                 )}
                              </Button>
                           </div>
                        }
                     />
                     <InfoRow label="Eligibility" value={eligibilityLabel} />
                     <InfoRow label="Next claim" value={nextClaimLabel} />
                  </div>
               ) : null}
            </div>
         </Card>
      </div>
   );
}
