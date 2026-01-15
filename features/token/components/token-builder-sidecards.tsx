import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Coins, Shield } from 'lucide-react';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

type FieldStackProps = {
   id: string;
   label: string;
   children: ReactNode;
};

function FieldStack({ id, label, children }: FieldStackProps) {
   return (
      <div className="space-y-2">
         <label className={labelClass} htmlFor={id}>
            {label}
         </label>
         {children}
      </div>
   );
}

export function TokenBuilderSidecards() {
   return (
      <div className="space-y-8">
         <Card className={cardShell}>
            <CardHeader>
               <CardTitle>Mint Desk</CardTitle>
               <CardDescription>Mint additional supply into your wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <FieldStack id="mint-desk-address" label="Mint address">
                  <Input id="mint-desk-address" placeholder="Mint public key" />
               </FieldStack>
               <FieldStack id="mint-desk-amount" label="Amount">
                  <Input id="mint-desk-amount" type="number" min={0} placeholder="250,000" />
               </FieldStack>
               <Button type="button" className="w-full">
                  Mint tokens
               </Button>
               <p className="text-muted-foreground text-xs">Requires mint authority on the token.</p>
            </CardContent>
         </Card>

         <Card className={cardShell}>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Authority Desk</CardTitle>
                     <CardDescription>Transfer or revoke mint and freeze powers.</CardDescription>
                  </div>
                  <Badge variant="outline">Critical</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-5">
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                     <Coins className="text-primary size-4" />
                     Mint authority
                  </div>
                  <FieldStack id="authority-mint-address" label="Mint address">
                     <Input id="authority-mint-address" placeholder="Mint address" />
                  </FieldStack>
                  <FieldStack id="authority-mint-new" label="New authority">
                     <Input id="authority-mint-new" placeholder="New authority address or leave empty to revoke" />
                  </FieldStack>
                  <div className="flex gap-2">
                     <Button type="button" variant="secondary" className="flex-1">
                        Transfer
                     </Button>
                     <Button type="button" variant="outline" className="flex-1">
                        Revoke
                     </Button>
                  </div>
               </div>
               <Separator />
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                     <Shield className="text-primary size-4" />
                     Freeze authority
                  </div>
                  <FieldStack id="authority-freeze-address" label="Mint address">
                     <Input id="authority-freeze-address" placeholder="Mint address" />
                  </FieldStack>
                  <FieldStack id="authority-freeze-new" label="New authority">
                     <Input
                        id="authority-freeze-new"
                        placeholder="New authority address or leave empty to revoke"
                     />
                  </FieldStack>
                  <div className="flex gap-2">
                     <Button type="button" variant="secondary" className="flex-1">
                        Transfer
                     </Button>
                     <Button type="button" variant="outline" className="flex-1">
                        Revoke
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
