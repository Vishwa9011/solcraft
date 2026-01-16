'use client';

import Link from 'next/link';
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
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
} from '@/components/ui/sidebar';
import { Coins, Droplet, LayoutGrid, Settings2, Sparkles } from 'lucide-react';

type AppSidebarProps = {
   pathname: string;
};

const primaryNav = [
   { label: 'Overview', href: '/overview', icon: LayoutGrid },
   { label: 'Token', href: '/token', icon: Coins },
   { label: 'Faucet', href: '/faucet', icon: Droplet },
];

const adminNav = [{ label: 'Admin Console', href: '/admin', icon: Settings2 }];

export function AppSidebar({ pathname }: AppSidebarProps) {
   return (
      <Sidebar variant="floating" collapsible="icon">
         <SidebarHeader className="px-3 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-1">
            <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
               <div className="bg-primary/15 text-primary ring-primary/15 shadow-primary/10 flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1">
                  <Sparkles className="size-4" />
               </div>
               <div className="min-w-0 flex-1 space-y-0.5 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm leading-none font-semibold tracking-wide">Solcraft</p>
                  <p className="text-muted-foreground text-[10px] tracking-[0.24em] uppercase">Token studio</p>
               </div>
            </div>
         </SidebarHeader>
         <SidebarSeparator className="mx-0 group-data-[collapsible=icon]:hidden" />
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
            <Button
               variant="secondary"
               className="w-full justify-between gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
               <span className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">Launch checklist</span>
               </span>
               <span className="text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">Beta</span>
            </Button>
         </SidebarFooter>
      </Sidebar>
   );
}
