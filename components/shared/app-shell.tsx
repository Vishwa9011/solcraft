'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
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
      subtitle: 'Mission control for your Solana token factory.',
   },
   '/token-builder': {
      title: 'Token Builder',
      subtitle: 'Create new mints and manage supply authority.',
   },
   '/faucet': {
      title: 'Faucet',
      subtitle: 'Control free mints and claim limits for users.',
   },
   '/admin': {
      title: 'Admin Console',
      subtitle: 'Factory controls, fee updates, and treasury actions.',
   },
};

export function AppShell({ children }: AppShellProps) {
   const pathname = usePathname();
   const current = pageMeta[pathname] ?? {
      title: 'Solcraft',
      subtitle: 'Create and manage Solana tokens with confidence.',
   };

   return (
      <SidebarProvider defaultOpen>
         <AppSidebar pathname={pathname} />
         <SidebarInset className="bg-transparent">
            <div className="flex min-h-svh flex-col md:min-h-[calc(100svh-1rem)] md:p-2">
               <header className="border-border/60 bg-background/65 supports-backdrop-filter:bg-background/55 flex flex-col gap-3 border-b px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:rounded-2xl md:border md:border-b-0 md:px-5 md:py-4 md:shadow-sm">
                  <div className="flex items-start gap-3 md:items-center">
                     <SidebarTrigger className="md:hidden" />
                     <div className="max-w-xl space-y-1">
                        <p className="text-muted-foreground text-[9px] tracking-[0.24em] uppercase">Solcraft</p>
                        <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl lg:text-2xl">
                           {current.title}
                        </h1>
                        <p className="text-muted-foreground text-sm text-pretty">{current.subtitle}</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                     <Badge variant="secondary" className="w-fit">
                        Localnet
                     </Badge>
                     <div className={cn('w-full sm:w-56')}>
                        <ConnectButton />
                     </div>
                  </div>
               </header>
               <div className="flex-1 pt-8 pb-12">
                  <div className="mx-auto w-full">{children}</div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
