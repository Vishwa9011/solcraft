'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TokenFormField } from '@/features/token/components/token-form-field';
import { type TokenFormValues } from '@/features/token/lib/token-builder-schema';
import { UploadCloud } from 'lucide-react';

export function TokenBuilderMetadata() {
   const { control, setValue } = useFormContext<TokenFormValues>();
   const [useLogoUrl, setUseLogoUrl] = useState(false);

   const handleLogoMode = (nextMode: boolean) => {
      setUseLogoUrl(nextMode);
      if (!nextMode) {
         setValue('logoUrl', '');
      }
   };

   return (
      <>
         <TokenFormField
            control={control}
            name="logoUrl"
            label="Logo"
            description={useLogoUrl ? 'Square logo works best for wallets.' : undefined}
            actions={
               <>
                  <Button
                     type="button"
                     variant={useLogoUrl ? 'outline' : 'secondary'}
                     size="sm"
                     onClick={() => handleLogoMode(false)}
                  >
                     Upload
                  </Button>
                  <Button
                     type="button"
                     variant={useLogoUrl ? 'secondary' : 'outline'}
                     size="sm"
                     onClick={() => handleLogoMode(true)}
                  >
                     URL
                  </Button>
               </>
            }
            render={field =>
               useLogoUrl ? (
                  <Input type="url" placeholder="https://example.com/logo.png" {...field} />
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
               )
            }
         />
         <TokenFormField
            control={control}
            name="description"
            label="Description"
            description="This appears on metadata explorers."
            render={field => <Textarea placeholder="Describe your token for explorers and wallets." {...field} />}
         />
      </>
   );
}
