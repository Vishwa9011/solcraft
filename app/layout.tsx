import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/shared/app-shell';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
   title: {
      default: 'Solcraft',
      template: '%s · Solcraft',
   },
   description: 'Build and operate SPL token products with metadata, faucets, and admin controls.',
   icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/logo.png',
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className="dark">
         <Providers>
            <body suppressHydrationWarning className="antialiased">
               <AppShell>{children}</AppShell>
               <Toaster position="top-right" richColors />
            </body>
         </Providers>
      </html>
   );
}
