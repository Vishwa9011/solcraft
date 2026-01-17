'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { ConnectButton } from '@/features/wallet';
import { cn } from '@/lib/utils';

type AppShellProps = {
   children: ReactNode;
};

const pageMeta: Record<string, { title: string; subtitle: string }> = {
   '/overview': {
      title: 'Overview',
      subtitle: 'Monitor your Solcraft suite and keep token ops on track.',
   },
   '/token': {
      title: 'Token Builder',
      subtitle: 'Create SPL tokens with metadata, supply, and authority controls.',
   },
   '/faucet': {
      title: 'Faucet',
      subtitle: 'Configure free mints, claim limits, and cooldowns.',
   },
   '/admin': {
      title: 'Admin Console',
      subtitle: 'Factory setup, fee management, and treasury actions.',
   },
};

const contentShell = 'mx-auto w-full max-w-6xl';

export function AppShell({ children }: AppShellProps) {
   const pathname = usePathname();
   const current = pageMeta[pathname] ?? {
      title: 'Solcraft',
      subtitle: 'Build and operate SPL token products with confidence.',
   };

   return (
      <SidebarProvider defaultOpen>
         <AppSidebar pathname={pathname} />
         <SidebarInset className="bg-transparent">
            <div className="flex min-h-svh flex-col md:min-h-[calc(100svh-1rem)] md:p-2">
               <header
                  className={cn(
                     'border-border/60 bg-background/65 supports-backdrop-filter:bg-background/55 flex flex-col gap-4 border-b px-4 py-4 backdrop-blur md:rounded-2xl md:border md:border-b-0 md:px-6 md:py-5 md:shadow-sm',
                     contentShell
                  )}
               >
                  <div className="flex items-center justify-between gap-3 md:hidden">
                     <div className="flex min-w-0 items-center gap-3">
                        <SidebarTrigger className="md:hidden" />
                        <div className="bg-primary/10 text-primary ring-primary/15 flex size-9 items-center justify-center rounded-xl ring-1">
                           <Image src="/logo.png" alt="Solcraft" width={16} height={16} className="size-4" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm leading-none font-semibold">Solcraft</p>
                           <p className="text-muted-foreground text-[11px] leading-none">Solana app suite</p>
                        </div>
                     </div>
                     <div className="shrink-0">
                        <ConnectButton />
                     </div>
                  </div>
                  <div className="hidden items-center justify-between gap-6 md:flex">
                     <div className="flex items-start gap-3 md:items-center">
                        <div className="max-w-xl space-y-1">
                           <div className="text-muted-foreground flex items-center gap-2 text-[9px] tracking-[0.24em] uppercase">
                              <Image src="/logo.png" alt="Solcraft" width={14} height={14} className="size-3.5" />
                              <span>Solcraft</span>
                           </div>
                           <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl lg:text-2xl">
                              {current.title}
                           </h1>
                           <p className="text-muted-foreground text-sm text-pretty">{current.subtitle}</p>
                        </div>
                     </div>
                     <div className="w-52 shrink-0">
                        <ConnectButton />
                     </div>
                  </div>
               </header>
               <div className="flex-1 pt-4 pb-12 sm:pt-8">
                  <div className={cn(contentShell, 'px-3 sm:px-0')}>{children}</div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
