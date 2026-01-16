import { lamportsToSolString } from '@solana/client';
import type { Lamports } from '@solana/kit';

export function formatAddress(address: string, visibleChars = 4) {
   if (address.length <= visibleChars * 2) return address;
   return `${address.slice(0, visibleChars)}...${address.slice(-visibleChars)}`;
}

export function formatSolBalance(lamports: Lamports | null) {
   if (lamports === null) return null;
   return lamportsToSolString(lamports, { minimumFractionDigits: 2, trimTrailingZeros: true });
}
