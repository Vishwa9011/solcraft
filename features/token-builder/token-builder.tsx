'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
   ChevronDown,
   ChevronUp,
   Coins,
   Shield,
   UploadCloud,
} from 'lucide-react';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

export function TokenBuilder() {
   const [showAdvanced, setShowAdvanced] = useState(true);
   const [useLogoUrl, setUseLogoUrl] = useState(false);

   return (
      <div className="space-y-12">
         <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-8">
               <Card className={cn(cardShell, 'relative overflow-hidden')}>
                  <CardHeader className="space-y-1">
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle>Token Builder</CardTitle>
                           <CardDescription>Create an SPL token with metadata and supply controls.</CardDescription>
                        </div>
                        <Badge variant="secondary">Step 1</Badge>
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <label className={labelClass}>
                              Token name <span className="text-primary">*</span>
                           </label>
                           <Input placeholder="My awesome token" />
                           <p className="text-muted-foreground text-xs">Max 30 characters.</p>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}>
                              Token symbol <span className="text-primary">*</span>
                           </label>
                           <Input placeholder="AWESOME" />
                           <p className="text-muted-foreground text-xs">Max 10 characters.</p>
                        </div>
                     </div>
                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <label className={labelClass}>
                              Decimals <span className="text-primary">*</span>
                           </label>
                           <Input type="number" min={0} max={9} placeholder="9" />
                           <p className="text-muted-foreground text-xs">Change the number of decimals.</p>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}>
                              Supply <span className="text-primary">*</span>
                           </label>
                           <Input type="number" min={0} placeholder="1,000,000,000" />
                           <p className="text-muted-foreground text-xs">Initial supply minted to your wallet.</p>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className={labelClass}>Metadata URI</label>
                        <Input type="url" placeholder="https://example.com/token.json" />
                        <p className="text-muted-foreground text-xs">IPFS or HTTPS metadata link.</p>
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                           <label className={labelClass}>Logo</label>
                           <div className="flex items-center gap-2">
                              <Button
                                 type="button"
                                 variant={useLogoUrl ? 'outline' : 'secondary'}
                                 size="sm"
                                 onClick={() => setUseLogoUrl(false)}
                              >
                                 Upload
                              </Button>
                              <Button
                                 type="button"
                                 variant={useLogoUrl ? 'secondary' : 'outline'}
                                 size="sm"
                                 onClick={() => setUseLogoUrl(true)}
                              >
                                 URL
                              </Button>
                           </div>
                        </div>
                        {useLogoUrl ? (
                           <Input type="url" placeholder="https://example.com/logo.png" />
                        ) : (
                           <div className="border-border/60 bg-muted/20 flex items-center gap-4 rounded-2xl border border-dashed p-4">
                              <div className="bg-secondary text-secondary-foreground flex size-14 items-center justify-center rounded-2xl">
                                 <UploadCloud className="size-5" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-semibold">Upload token logo</p>
                                 <p className="text-muted-foreground text-xs">SVG, PNG, or WEBP up to 2MB.</p>
                              </div>
                              <Button type="button" variant="secondary" size="sm">
                                 Select file
                              </Button>
                           </div>
                        )}
                     </div>
                     <div className="space-y-2">
                        <label className={labelClass}>Description</label>
                        <Textarea placeholder="Describe your token for explorers and wallets." />
                        <p className="text-muted-foreground text-xs">This appears on metadata explorers.</p>
                     </div>
                     <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="text-muted-foreground text-xs">
                           Estimated fee <span className="text-foreground font-semibold">0.1 SOL</span>
                        </div>
                        <Button type="button" className="md:w-auto">
                           Create token
                        </Button>
                     </div>
                  </CardContent>
               </Card>

               <Card className={cardShell}>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle>Social and metadata</CardTitle>
                           <CardDescription>Optional links that show up in explorers.</CardDescription>
                        </div>
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => setShowAdvanced(value => !value)}
                           className="text-muted-foreground"
                        >
                           {showAdvanced ? 'Hide' : 'Show'} more options
                           {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </Button>
                     </div>
                  </CardHeader>
                  {showAdvanced ? (
                     <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <label className={labelClass}>Website</label>
                           <Input type="url" placeholder="https://mytoken.io" />
                           <p className="text-muted-foreground text-xs">Main landing page.</p>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}>Twitter or X</label>
                           <Input type="url" placeholder="https://x.com/mytoken" />
                           <p className="text-muted-foreground text-xs">Public updates and releases.</p>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}>Telegram</label>
                           <Input type="url" placeholder="https://t.me/mytoken" />
                           <p className="text-muted-foreground text-xs">Community support.</p>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}>Discord</label>
                           <Input type="url" placeholder="https://discord.gg/mytoken" />
                           <p className="text-muted-foreground text-xs">Core community hub.</p>
                        </div>
                     </CardContent>
                  ) : (
                     <CardContent className="text-muted-foreground text-sm">
                        Add optional socials, website, and community links.
                     </CardContent>
                  )}
               </Card>
            </div>

            <div className="space-y-8">
               <Card className={cardShell}>
                  <CardHeader>
                     <CardTitle>Mint Desk</CardTitle>
                     <CardDescription>Mint additional supply into your wallet.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <label className={labelClass}>Mint address</label>
                        <Input placeholder="Mint public key" />
                     </div>
                     <div className="space-y-2">
                        <label className={labelClass}>Amount</label>
                        <Input type="number" min={0} placeholder="250,000" />
                     </div>
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
                           <Coins className="size-4 text-primary" />
                           Mint authority
                        </div>
                        <Input placeholder="Mint address" />
                        <Input placeholder="New authority address or leave empty to revoke" />
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
                           <Shield className="size-4 text-primary" />
                           Freeze authority
                        </div>
                        <Input placeholder="Mint address" />
                        <Input placeholder="New authority address or leave empty to revoke" />
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
         </section>
      </div>
   );
}
