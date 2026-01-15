import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/shared/app-shell';

const spaceGrotesk = Space_Grotesk({
   variable: '--font-space-grotesk',
   subsets: ['latin'],
   display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
   variable: '--font-jetbrains-mono',
   subsets: ['latin'],
   display: 'swap',
});

export const metadata: Metadata = {
   title: 'Solcraft',
   description: 'Create and manage Solana tokens with ease.',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className="dark">
         <Providers>
            <body
               suppressHydrationWarning
               className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
            >
               <AppShell>{children}</AppShell>
            </body>
         </Providers>
      </html>
   );
}
