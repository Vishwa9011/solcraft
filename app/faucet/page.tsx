import type { Metadata } from 'next';
import { FaucetDesk } from '@/features/faucet/faucet-desk';

export const metadata: Metadata = {
   title: 'Faucet',
   description: 'Configure free mints, claim limits, and cooldowns.',
};

export default function FaucetPage() {
   return <FaucetDesk />;
}
