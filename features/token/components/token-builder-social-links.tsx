'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenBuilderSection } from '@/features/token/components/token-builder-section';
import { TokenFormField } from '@/features/token/components/token-form-field';
import { type TokenFormValues } from '@/features/token/lib/token-builder-schema';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function TokenBuilderSocialLinks() {
   const { control, watch } = useFormContext<TokenFormValues>();
   const [showAdvanced, setShowAdvanced] = useState(false);
   const [website, twitter, telegram, discord] = watch(['website', 'twitter', 'telegram', 'discord']);
   const socialCount = [website, twitter, telegram, discord].filter(Boolean).length;

   const actions = (
      <>
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
      </>
   );

   return (
      <TokenBuilderSection
         title="Social links"
         description="Optional links that show up in explorers."
         actions={actions}
         className={cn(showAdvanced && 'border-border/40 bg-muted/10 rounded-2xl border p-4')}
      >
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
      </TokenBuilderSection>
   );
}
