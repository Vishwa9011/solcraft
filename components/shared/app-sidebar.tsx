'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenuBadge,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
} from '@/components/ui/sidebar';
import { useFactoryAdmin } from '@/features/factory';
import {
   Coins,
   Droplet,
   ExternalLink,
   LayoutGrid,
   Plus,
   Settings2,
   ShieldCheck,
   Sparkles,
   Timer,
   TrendingUp,
} from 'lucide-react';

type AppSidebarProps = {
   pathname: string;
};

type NavItem = {
   label: string;
   href?: string;
   icon: typeof LayoutGrid;
   badge?: string;
   disabled?: boolean;
};

const coreNav: NavItem[] = [
   { label: 'Overview', href: '/overview', icon: LayoutGrid },
   { label: 'Token Builder', href: '/token', icon: Coins },
   { label: 'Faucet', href: '/faucet', icon: Droplet },
];

const suiteNav: NavItem[] = [
   { label: 'Solcraft Vault', icon: Timer, href: 'https://solcraft-vault.vercel.app' },
   { label: 'Staking', icon: TrendingUp, badge: 'Soon', disabled: true },
];

const adminNav: NavItem[] = [{ label: 'Admin Console', href: '/admin', icon: Settings2 }];

export function AppSidebar({ pathname }: AppSidebarProps) {
   const { isAdmin: showAdmin } = useFactoryAdmin();

   return (
      <Sidebar variant="floating" collapsible="icon">
         <SidebarHeader className="px-3 pt-4 pb-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
            <Link
               href="/overview"
               className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
            >
               <div className="bg-primary/10 text-primary ring-primary/15 flex size-9 shrink-0 items-center justify-center rounded-xl ring-1">
                  <Image src="/logo.png" alt="Solcraft" width={18} height={18} className="size-4" />
               </div>
               <div className="min-w-0 flex-1 space-y-0.5 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm leading-none font-semibold">Solcraft</p>
                  <p className="text-muted-foreground text-[11px]">Solana app suite</p>
               </div>
            </Link>
         </SidebarHeader>
         <div className="px-3 group-data-[collapsible=icon]:hidden">
            <SidebarSeparator className="mx-0 opacity-60" />
         </div>
         <SidebarContent className="gap-5 group-data-[collapsible=icon]:gap-2">
            <SidebarGroup className="group-data-[collapsible=icon]:p-1">
               <SidebarGroupLabel>Workspace</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {coreNav.map(item => (
                        <SidebarMenuItem key={item.label}>
                           {item.href ? (
                              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                 <Link href={item.href} className="min-w-0">
                                    <item.icon />
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                                 </Link>
                              </SidebarMenuButton>
                           ) : (
                              <SidebarMenuButton disabled tooltip={item.label}>
                                 <item.icon />
                                 <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                              </SidebarMenuButton>
                           )}

                           {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="group-data-[collapsible=icon]:p-1">
               <SidebarGroupLabel>Solcraft apps</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {suiteNav.map(item => (
                        <SidebarMenuItem key={item.label}>
                           {item.href ? (
                              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                 <Link
                                    href={item.href}
                                    className="flex min-w-0 items-center gap-2"
                                    target="_blank"
                                    rel="noreferrer"
                                 >
                                    <item.icon />
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                                    <ExternalLink className="text-muted-foreground ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                                 </Link>
                              </SidebarMenuButton>
                           ) : (
                              <SidebarMenuButton disabled tooltip={item.label} className="text-muted-foreground">
                                 <item.icon />
                                 <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                              </SidebarMenuButton>
                           )}
                           {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            {showAdmin ? (
               <SidebarGroup className="group-data-[collapsible=icon]:p-1">
                  <SidebarGroupLabel>Admin</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {adminNav.map(item => (
                           <SidebarMenuItem key={item.label}>
                              {item.href ? (
                                 <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                    <Link href={item.href} className="min-w-0">
                                       <item.icon />
                                       <span className="truncate group-data-[collapsible=icon]:hidden">
                                          {item.label}
                                       </span>
                                    </Link>
                                 </SidebarMenuButton>
                              ) : (
                                 <SidebarMenuButton disabled tooltip={item.label}>
                                    <item.icon />
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                                 </SidebarMenuButton>
                              )}
                              {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ) : null}
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
