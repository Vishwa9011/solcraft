import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

export default function Admin() {
   return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
         <Card className={cardShell}>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Factory controls</CardTitle>
                     <CardDescription>Manage initialization and pause state.</CardDescription>
                  </div>
                  <Badge variant="secondary">Admin only</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="button" variant="secondary">
                     Initialize
                  </Button>
                  <Button type="button" variant="outline">
                     Pause
                  </Button>
                  <Button type="button" variant="secondary">
                     Unpause
                  </Button>
                  <Button type="button" variant="outline">
                     Withdraw fees
                  </Button>
               </div>
               <Separator />
               <div className="space-y-2">
                  <label className={labelClass}>Creation fee (SOL)</label>
                  <Input type="number" min={0} step="0.01" placeholder="0.1" />
                  <Button type="button" className="w-full">
                     Update fee
                  </Button>
               </div>
            </CardContent>
         </Card>

         <Card className={cardShell}>
            <CardHeader>
               <CardTitle>Factory status</CardTitle>
               <CardDescription>Latest on-chain configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-foreground font-semibold">Active</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Creation fee</span>
                  <span className="text-foreground font-semibold">0.1 SOL</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Treasury</span>
                  <span className="text-foreground font-semibold">0.42 SOL</span>
               </div>
               <Separator />
               <p className="text-muted-foreground text-xs">
                  Connect an admin wallet to update the factory configuration.
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
