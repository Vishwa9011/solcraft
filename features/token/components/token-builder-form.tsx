'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { TokenBuilderBasics } from '@/features/token/components/token-builder-basics';
import { TokenBuilderMetadata } from '@/features/token/components/token-builder-metadata';
import { TokenBuilderSocialLinks } from '@/features/token/components/token-builder-social-links';
import { tokenFormDefaults, tokenFormSchema, type TokenFormValues } from '@/features/token/lib/token-builder-schema';
import { useTokenActions } from '../hooks';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';

export function TokenBuilderForm() {
   const { createToken } = useTokenActions();

   const form = useForm<TokenFormValues>({
      resolver: zodResolver(tokenFormSchema),
      defaultValues: tokenFormDefaults,
      mode: 'onBlur',
   });

   const onSubmit = useMutation({
      mutationFn: async (values: TokenFormValues) => {
         const res = await fetch('/api/metadata', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               name: values.name,
               symbol: values.symbol,
               decimals: Number(values.decimals),
               description: values.description || undefined,
               image: values.logoUrl || undefined,
               external_url: values.website || undefined,
               twitter: values.twitter || undefined,
               discord: values.discord || undefined,
               website: values.website || undefined,
               telegram: values.telegram || undefined,
            }),
         });

         const data = await res.json();
         if (!res.ok) {
            throw new Error(data.error || 'Failed to upload metadata');
         }

         await createToken.mutateAsync({
            name: values.name,
            symbol: values.symbol,
            decimals: Number(values.decimals),
            supply: Number(values.supply),
            uri: data.url,
         });
      },
      onSuccess: data => {},
   });

   return (
      <Form {...form}>
         <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit.mutateAsync as any)} noValidate>
            <Card className={`${cardShell} relative overflow-hidden`}>
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
                  <TokenBuilderBasics />
                  <TokenBuilderMetadata />
                  <Separator />
                  <TokenBuilderSocialLinks />
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                     <div className="text-muted-foreground text-xs">
                        Estimated fee <span className="text-foreground font-semibold">0.1 SOL</span>
                     </div>
                     <Button type="submit" className="md:w-auto" disabled={form.formState.isSubmitting}>
                        Create token
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </form>
      </Form>
   );
}
