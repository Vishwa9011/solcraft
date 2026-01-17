import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/shared/app-shell';
import { Toaster } from '@/components/ui/sonner';

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

const sora = Sora({
   variable: '--font-sora',
   subsets: ['latin'],
   weight: ['400', '500', '600'],
   display: 'swap',
});

export const metadata: Metadata = {
   title: 'Solcraft',
   description: 'Create and manage Solana tokens with ease.',
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
            <body
               suppressHydrationWarning
               className={`${sora.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
            >
               <AppShell>{children}</AppShell>
               <Toaster position="top-right" />
            </body>
         </Providers>
      </html>
   );
}
