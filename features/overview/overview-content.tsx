import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Coins, Droplet, Gauge, ShieldCheck, Sparkles } from 'lucide-react';

const cardShell = 'border-border/60 bg-card/80 shadow-sm';

const quickStatus = [
   {
      label: 'Factory',
      value: 'Ready',
      detail: 'Creation fee 0.1 SOL',
      icon: Sparkles,
   },
   {
      label: 'Treasury',
      value: '0.42 SOL',
      detail: 'Awaiting withdrawal',
      icon: Gauge,
   },
   {
      label: 'Faucet',
      value: 'Cooldown 24h',
      detail: 'Limit 500 tokens',
      icon: Droplet,
   },
];

const modules = [
   {
      label: 'Token Builder',
      description: 'Create mints, set supply, and handle metadata.',
      href: '/token-builder',
      icon: Coins,
   },
   {
      label: 'Faucet',
      description: 'Configure free mints, limits, and cooldowns.',
      href: '/faucet',
      icon: Droplet,
   },
   {
      label: 'Admin Console',
      description: 'Pause factory, update fees, withdraw treasury.',
      href: '/admin',
      icon: ShieldCheck,
   },
];

export function OverviewContent() {
   return (
      <div className="space-y-12">
         <section className={cn(cardShell, 'rounded-3xl p-8 lg:p-10')}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
               <div className="space-y-3">
                  <Badge variant="secondary" className="w-fit">
                     Production-ready UI
                  </Badge>
                  <h2 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                     Build and manage Solana tokens in one place.
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                     Overview is your mission control. We will add stats, on-chain summaries, and actionable insights
                     once the analytics plan is finalized.
                  </p>
               </div>
               <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                     <Link href="/token-builder">Create a token</Link>
                  </Button>
                  <Button asChild variant="secondary">
                     <Link href="/faucet">Open faucet</Link>
                  </Button>
               </div>
            </div>
         </section>

         <section className="grid gap-4 md:grid-cols-3">
            {quickStatus.map(item => (
               <Card key={item.label} className={cn(cardShell, 'rounded-2xl')}>
                  <CardContent className="flex items-center gap-4 p-4">
                     <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                        <item.icon className="size-5" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{item.label}</p>
                        <p className="text-foreground text-lg font-semibold">{item.value}</p>
                        <p className="text-muted-foreground text-xs">{item.detail}</p>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </section>

         <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Card className={cn(cardShell, 'rounded-2xl')}>
               <CardHeader>
                  <CardTitle>Workspace modules</CardTitle>
                  <CardDescription>Jump into the flow you need.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  {modules.map((module, index) => (
                     <div key={module.label}>
                        <div className="flex items-center justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className="bg-primary/10 text-primary mt-1 flex size-9 items-center justify-center rounded-lg">
                                 <module.icon className="size-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-semibold">{module.label}</p>
                                 <p className="text-muted-foreground text-xs">{module.description}</p>
                              </div>
                           </div>
                           <Button asChild variant="secondary" size="sm">
                              <Link href={module.href}>Open</Link>
                           </Button>
                        </div>
                        {index < modules.length - 1 ? <Separator className="mt-4" /> : null}
                     </div>
                  ))}
               </CardContent>
            </Card>

            <Card className={cn(cardShell, 'rounded-2xl')}>
               <CardHeader>
                  <CardTitle>Planned stats</CardTitle>
                  <CardDescription>Reserved for upcoming analytics.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="border-border/70 text-muted-foreground rounded-xl border border-dashed p-4">
                     We will surface mint counts, claimed faucet amounts, and authority changes here once the tracking
                     plan is finalized.
                  </div>
                  <div className="space-y-2">
                     <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Next focus</p>
                     <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Mint KPIs</Badge>
                        <Badge variant="secondary">Faucet velocity</Badge>
                        <Badge variant="secondary">Fee revenue</Badge>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </section>
      </div>
   );
}
