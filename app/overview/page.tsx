import type { Metadata } from 'next';
import { OverviewContent } from '@/features/overview/overview-content';

export const metadata: Metadata = {
   title: 'Overview',
   description: 'Monitor your Solcraft suite and keep token ops on track.',
};

export default function OverviewPage() {
   return <OverviewContent />;
}
