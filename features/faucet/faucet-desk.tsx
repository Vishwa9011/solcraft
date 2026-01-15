import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Droplet, Timer, Wallet } from 'lucide-react';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

export function FaucetDesk() {
   return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
         <Card className={cardShell}>
            <CardHeader>
               <CardTitle>Free Mint Faucet</CardTitle>
               <CardDescription>Let users claim limited tokens on a cooldown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
               <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Limit 500 tokens</Badge>
                  <Badge variant="secondary">Cooldown 24h</Badge>
                  <Badge variant="secondary">Treasury ready</Badge>
               </div>
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <label className={labelClass}>Mint address</label>
                     <Input placeholder="Mint public key" />
                  </div>
                  <div className="space-y-2">
                     <label className={labelClass}>Recipient</label>
                     <Input placeholder="Wallet address" />
                  </div>
               </div>
               <Button type="button" className="w-full">
                  Claim free tokens
               </Button>
               <p className="text-muted-foreground text-xs">
                  Claiming is subject to cooldown and per-wallet limits.
               </p>
               <Separator />
               <div className="space-y-3">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Admin actions</p>
                  <Input placeholder="Mint address" />
                  <Input type="number" min={0} placeholder="Deposit amount" />
                  <div className="grid gap-2 sm:grid-cols-3">
                     <Button type="button" variant="secondary">
                        Initialize
                     </Button>
                     <Button type="button" variant="secondary">
                        Deposit
                     </Button>
                     <Button type="button" variant="outline">
                        Withdraw
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="space-y-8">
            <Card className={cardShell}>
               <CardHeader>
                  <CardTitle>Claim status</CardTitle>
                  <CardDescription>Latest faucet activity for this wallet.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center gap-2">
                        <Timer className="size-4" />
                        Next claim
                     </span>
                     <span className="font-semibold text-foreground">in 19h 42m</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center gap-2">
                        <Wallet className="size-4" />
                        Wallet status
                     </span>
                     <span className="font-semibold text-foreground">Eligible</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center gap-2">
                        <Droplet className="size-4" />
                        Last claim
                     </span>
                     <span className="font-semibold text-foreground">500 tokens</span>
                  </div>
               </CardContent>
            </Card>

            <Card className={cn(cardShell, 'border-dashed')}>
               <CardHeader>
                  <CardTitle>Faucet guardrails</CardTitle>
                  <CardDescription>Protecting supply from abuse.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Cooldown and per-wallet limits are enforced on-chain.</p>
                  <p>Use the admin actions to replenish treasury safely.</p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
