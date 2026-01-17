'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TokenFormField } from '@/features/token/components/token-form-field';
import { type TokenFormValues } from '@/features/token/lib/token-builder-schema';
import { UploadCloud } from 'lucide-react';

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const LOGO_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

const formatBytes = (bytes: number) => {
   if (!bytes) return '0 KB';
   const kb = bytes / 1024;
   return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(2)} MB`;
};

export function TokenBuilderMetadata() {
   const { control, setValue, setError, clearErrors } = useFormContext<TokenFormValues>();
   const [useLogoUrl, setUseLogoUrl] = useState(false);
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleLogoMode = (nextMode: boolean) => {
      setUseLogoUrl(nextMode);
      if (nextMode) {
         setValue('logoFile', null, { shouldDirty: true, shouldValidate: true });
         clearErrors('logoFile');
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
         }
      } else {
         setValue('logoUrl', '', { shouldDirty: true, shouldValidate: true });
      }
   };

   const handleFileChange = (event: ChangeEvent<HTMLInputElement>, onChange: (value: File | null) => void) => {
      const file = event.target.files?.[0] ?? null;

      if (!file) {
         clearErrors('logoFile');
         onChange(null);
         return;
      }

      if (!LOGO_MIME_TYPES.has(file.type)) {
         setError('logoFile', { type: 'manual', message: 'Use SVG, PNG, or WEBP images only.' });
         onChange(null);
         event.target.value = '';
         return;
      }

      if (file.size > MAX_LOGO_BYTES) {
         setError('logoFile', { type: 'manual', message: 'Logo must be 2MB or less.' });
         onChange(null);
         event.target.value = '';
         return;
      }

      clearErrors('logoFile');
      onChange(file);
   };

   const logoActions = (
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
   );

   return (
      <>
         {useLogoUrl ? (
            <TokenFormField
               control={control}
               name="logoUrl"
               label="Logo"
               description="Square logo works best for wallets."
               actions={logoActions}
               render={field => <Input type="url" placeholder="https://example.com/logo.png" {...field} />}
            />
         ) : (
            <TokenFormField
               control={control}
               name="logoFile"
               label="Logo"
               description="SVG, PNG, or WEBP up to 2MB."
               actions={logoActions}
               render={field => {
                  const file = field.value as File | null;
                  return (
                     <div className="border-border/40 bg-background/20 rounded-2xl border border-dashed p-3 sm:p-4">
                        <Input
                           ref={node => {
                              fileInputRef.current = node;
                              field.ref(node);
                           }}
                           type="file"
                           accept="image/png,image/jpeg,image/webp,image/svg+xml"
                           className="sr-only"
                           name={field.name}
                           onBlur={field.onBlur}
                           onChange={event => handleFileChange(event, field.onChange)}
                        />
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                           <div className="flex items-center gap-3">
                              <div className="border-border/40 flex h-12 w-12 items-center justify-center rounded-xl border sm:h-14 sm:w-14">
                                 <UploadCloud className="text-muted-foreground size-5" />
                              </div>
                              <div className="min-w-0 space-y-1">
                                 <p className="text-foreground text-sm font-semibold">
                                    {file ? 'Logo ready' : 'Upload token logo'}
                                 </p>
                                 <p className="text-muted-foreground text-xs">
                                    {file ? (
                                       <span className="block truncate">
                                          {file.name} · {formatBytes(file.size)}
                                       </span>
                                    ) : (
                                       'SVG, PNG, or WEBP · max 2MB · square preferred.'
                                    )}
                                 </p>
                              </div>
                           </div>
                           <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
                              <Button
                                 type="button"
                                 variant="secondary"
                                 size="sm"
                                 className="w-full sm:w-auto"
                                 onClick={() => fileInputRef.current?.click()}
                              >
                                 {file ? 'Replace file' : 'Select file'}
                              </Button>
                              {file ? (
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                       field.onChange(null);
                                       if (fileInputRef.current) {
                                          fileInputRef.current.value = '';
                                       }
                                    }}
                                 >
                                    Remove
                                 </Button>
                              ) : null}
                           </div>
                        </div>
                     </div>
                  );
               }}
            />
         )}
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
