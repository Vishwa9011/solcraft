import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Admin Console',
   description: 'Factory setup, fee management, and treasury actions.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return children;
}
