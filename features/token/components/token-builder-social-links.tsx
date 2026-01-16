'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenFormField } from '@/features/token/components/token-form-field';
import { type TokenFormValues } from '@/features/token/lib/token-builder-schema';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function TokenBuilderSocialLinks() {
   const { control, watch } = useFormContext<TokenFormValues>();
   const [showAdvanced, setShowAdvanced] = useState(false);
   const [website, twitter, telegram, discord] = watch(['website', 'twitter', 'telegram', 'discord']);
   const socialCount = [website, twitter, telegram, discord].filter(Boolean).length;

   return (
      <div
         className={cn(
            'border-border/60 bg-muted/20 space-y-4 rounded-2xl border p-4',
            showAdvanced && 'border-primary/40'
         )}
      >
         <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
               <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Social links</p>
               <p className="text-muted-foreground text-sm">Optional links that show up in explorers.</p>
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="secondary">{socialCount}/4 linked</Badge>
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(value => !value)}
                  className="text-muted-foreground"
               >
                  {showAdvanced ? 'Hide' : 'Add'} links
                  {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
               </Button>
            </div>
         </div>
         {showAdvanced ? (
            <div className="animate-in fade-in slide-in-from-top-2 grid gap-4 duration-200 md:grid-cols-2">
               <TokenFormField
                  control={control}
                  name="website"
                  label="Website"
                  render={field => <Input type="url" placeholder="https://mytoken.io" {...field} />}
               />
               <TokenFormField
                  control={control}
                  name="twitter"
                  label="Twitter or X"
                  render={field => <Input type="url" placeholder="https://x.com/mytoken" {...field} />}
               />
               <TokenFormField
                  control={control}
                  name="telegram"
                  label="Telegram"
                  render={field => <Input type="url" placeholder="https://t.me/mytoken" {...field} />}
               />
               <TokenFormField
                  control={control}
                  name="discord"
                  label="Discord"
                  render={field => <Input type="url" placeholder="https://discord.gg/mytoken" {...field} />}
               />
            </div>
         ) : (
            <p className="text-muted-foreground text-sm">
               Add optional website, social, and community links for visibility across explorers.
            </p>
         )}
      </div>
   );
}
