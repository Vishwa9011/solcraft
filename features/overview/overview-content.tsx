import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Coins, Droplet, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const cardShell = 'border-border/60 bg-card/80 shadow-sm';

const modules = [
   {
      label: 'Token Builder',
      description: 'Create mints, set supply, and handle metadata.',
      href: '/token',
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

const insights = [
   'Offer guided minting flows for new builders and teams.',
   'Surface faucet eligibility to reduce confusion on limits.',
   'Track authority changes to assist compliance audits.',
];

export function OverviewContent() {
   return (
      <div className="space-y-10">
         <section className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/70 to-slate-950/90 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.65)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
               <div className="max-w-3xl space-y-4">
                  <Badge variant="secondary" className="w-fit">
                     Production-ready controls
                  </Badge>
                  <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight md:text-4xl lg:text-5xl">
                     Build, oversee, and evolve your SPL tokens from one premium console.
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                     Overview keeps your factory status, treasury health, and faucet throughput aligned with every
                     audience—from execs to operators.
                  </p>
               </div>
               <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                     <Link href="/token">Create a token</Link>
                  </Button>
                  <Button asChild variant="secondary">
                     <Link href="/faucet">Open faucet</Link>
                  </Button>
               </div>
            </div>
         </section>

         <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Card className={cn(cardShell, 'rounded-2xl')}>
               <CardHeader>
                  <CardTitle>Workspace modules</CardTitle>
                  <CardDescription>Jump into the curated flow you need.</CardDescription>
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
                  <CardTitle>Operating pulse</CardTitle>
                  <CardDescription>Highlights and next bets.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="border-border/70 rounded-xl border border-dashed p-4">
                     <p className="text-muted-foreground">
                        Live mint tracking + faucet risk analysis land here once the analytics plan ships.
                     </p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Premium focus</p>
                     <div className="space-y-2">
                        {insights.map(item => (
                           <div key={item} className="flex items-center gap-2">
                              <span className="text-primary text-base">•</span>
                              <p className="text-foreground text-sm">{item}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
         </section>
      </div>
   );
}
