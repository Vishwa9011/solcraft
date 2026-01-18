'use client';

import { useWalletSigner } from '@/features/wallet';
import { formatAddress } from '@/features/wallet/lib/format';
import { createTokenAmount } from '@solana/client';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useFaucetActions } from './use-faucet-actions';

dayjs.extend(duration);

function formatRemaining(seconds: number | null) {
   if (seconds === null) {
      return '-';
   }

   if (seconds <= 0) {
      return 'Ready now';
   }

   const remaining = dayjs.duration(seconds, 'seconds');
   const hours = Math.floor(remaining.asHours());
   const minutes = remaining.minutes();

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

   const remaining = dayjs.duration(seconds, 'seconds');
   const hours = Math.floor(remaining.asHours());
   const minutes = remaining.minutes();
   const secs = remaining.seconds();

   if (hours > 0) {
      return `${hours}h ${minutes}m`;
   }

   if (minutes > 0) {
      return `${minutes}m`;
   }

   return `${secs}s`;
}

type FaucetDeskState = {
   hasWallet: boolean;
   isInitialized: boolean;
   canClaim: boolean;
   claimLabel: string;
   claimAmountLabel: string;
   mintAddress: string;
   mintLabel: string;
   cooldownLabel: string;
   summaryLabel: string;
   eligibilityLabel: string;
   nextClaimLabel: string;
   onClaim: () => void;
};

export function useFaucetDeskState(): FaucetDeskState {
   const { claim, faucetConfig, recipientData, mintInfo } = useFaucetActions();
   const signer = useWalletSigner();
   const walletAddress = signer?.address?.toString() ?? '';
   const hasWallet = Boolean(walletAddress);

   if (!hasWallet) {
      return {
         hasWallet,
         isInitialized: false,
         canClaim: false,
         claimLabel: 'Claim tokens',
         claimAmountLabel: '-',
         mintAddress: '',
         mintLabel: '-',
         cooldownLabel: '-',
         summaryLabel: '',
         eligibilityLabel: '',
         nextClaimLabel: '',
         onClaim: () => undefined,
      };
   }

   const configData = faucetConfig.data?.exists ? faucetConfig.data.data : null;
   const cooldownSeconds = configData ? Number(configData.cooldownSeconds) : null;
   const tokenDecimals = typeof mintInfo.data?.data.decimals === 'number' ? mintInfo.data.data.decimals : null;
   const mintAddress = configData?.mint?.toString() ?? '';

   const isInitialized = Boolean(configData);
   if (!isInitialized) {
      return {
         hasWallet,
         isInitialized,
         canClaim: false,
         claimLabel: 'Claim tokens',
         claimAmountLabel: '-',
         mintAddress,
         mintLabel: mintAddress ? formatAddress(mintAddress, 6) : '-',
         cooldownLabel: '-',
         summaryLabel: 'Faucet not initialized. Contact admin.',
         eligibilityLabel: 'Unavailable',
         nextClaimLabel: 'Contact admin',
         onClaim: () => undefined,
      };
   }
   const isMintLoading = mintInfo.isLoading || mintInfo.isFetching;

   const recipientDataValue = recipientData.data?.data;
   const recipientLastClaimedAt = recipientDataValue ? Number(recipientDataValue.lastClaimedAt) : 0;

   const remainingCooldownSeconds =
      cooldownSeconds === null
         ? null
         : recipientLastClaimedAt
           ? Math.max(0, recipientLastClaimedAt + cooldownSeconds - dayjs().unix())
           : 0;

   const isClaiming = claim.isPending;
   const canClaim = remainingCooldownSeconds !== null && remainingCooldownSeconds <= 0 && !isClaiming;
   const claimLabel = isClaiming ? 'Claiming...' : 'Claim tokens';

   const tokenMath = tokenDecimals === null ? null : createTokenAmount(tokenDecimals);

   const cooldownLabel = formatDuration(cooldownSeconds);
   const mintLabel = mintAddress ? formatAddress(mintAddress, 6) : '-';
   const claimAmountLabel = !configData
      ? '-'
      : isMintLoading || !tokenMath
        ? 'Loading...'
        : tokenMath.toDecimalString(configData.allowedClaimAmount);
   const claimAmountText = isMintLoading || !tokenMath ? 'tokens' : claimAmountLabel;
   const summaryLabel = `Claim ${claimAmountText} once every ${cooldownLabel}.`;
   const nextClaimLabel = formatRemaining(remainingCooldownSeconds);
   const eligibilityLabel = remainingCooldownSeconds && remainingCooldownSeconds > 0 ? 'Cooldown' : 'Eligible';

   const onClaim = () => {
      void claim.mutateAsync();
   };

   return {
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
   };
}
