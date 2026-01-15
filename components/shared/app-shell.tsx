'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarInset,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarProvider,
   SidebarRail,
   SidebarSeparator,
   SidebarTrigger,
} from '@/components/ui/sidebar';
import { ConnectButton } from '@/features/wallet';
import { cn } from '@/lib/utils';
import { Coins, Droplet, LayoutGrid, Settings2, Sparkles } from 'lucide-react';

type AppShellProps = {
   children: ReactNode;
};

const primaryNav = [
   { label: 'Overview', href: '/overview', icon: LayoutGrid },
   { label: 'Token Builder', href: '/token-builder', icon: Coins },
   { label: 'Faucet', href: '/faucet', icon: Droplet },
];

const adminNav = [{ label: 'Admin Console', href: '/admin', icon: Settings2 }];

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
         <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="gap-3 pb-1">
               <div className="flex items-center gap-3">
                  <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-2xl">
                     <Sparkles className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1 group-data-[collapsible=icon]:hidden">
                     <p className="truncate text-sm leading-none font-semibold">Solcraft</p>
                     <p className="text-muted-foreground text-xs">Token studio</p>
                  </div>
               </div>
               <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
                  <Badge variant="outline" className="w-fit group-data-[collapsible=icon]:hidden">
                     Localnet
                  </Badge>
                  <SidebarTrigger className="hidden md:inline-flex" />
               </div>
            </SidebarHeader>
            <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
            <SidebarContent className="gap-4 group-data-[collapsible=icon]:gap-2">
               <SidebarGroup className="group-data-[collapsible=icon]:p-1">
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {primaryNav.map(item => (
                           <SidebarMenuItem key={item.label}>
                              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                 <Link href={item.href} className="min-w-0">
                                    <item.icon />
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
               <SidebarGroup className="group-data-[collapsible=icon]:p-1">
                  <SidebarGroupLabel>Admin</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {adminNav.map(item => (
                           <SidebarMenuItem key={item.label}>
                              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                 <Link href={item.href} className="min-w-0">
                                    <item.icon />
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
               <Button variant="secondary" className="w-full justify-between gap-2">
                  <span className="truncate group-data-[collapsible=icon]:hidden">Launch checklist</span>
                  <span className="text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">Beta</span>
               </Button>
            </SidebarFooter>
            <SidebarRail />
         </Sidebar>
         <SidebarInset>
            <div className="flex min-h-svh flex-col">
               <header className="border-border/60 bg-background/70 supports-[backdrop-filter]:bg-background/60 flex flex-col gap-4 border-b px-6 py-6 backdrop-blur md:flex-row md:items-center md:justify-between md:py-8">
                  <div className="flex items-start gap-3 md:items-center">
                     <SidebarTrigger className="md:hidden" />
                     <div className="max-w-2xl space-y-2">
                        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Solcraft</p>
                        <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                           {current.title}
                        </h1>
                        <p className="text-muted-foreground text-pretty text-sm md:text-base">
                           {current.subtitle}
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                     <Badge variant="secondary" className="w-fit">
                        Localnet
                     </Badge>
                     <div className={cn('w-full sm:w-[260px]')}>
                        <ConnectButton />
                     </div>
                  </div>
               </header>
               <div className="flex-1 px-6 pb-14 pt-10">
                  <div className="mx-auto w-full max-w-6xl">{children}</div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
