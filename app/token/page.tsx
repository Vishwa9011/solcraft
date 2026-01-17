import type { Metadata } from 'next';
import { TokenBuilder } from '@/features/token/components/token-builder';

export const metadata: Metadata = {
   title: 'Token Builder',
   description: 'Create SPL tokens with metadata, supply, and authority controls.',
};

export default function TokenPage() {
   return <TokenBuilder />;
}
