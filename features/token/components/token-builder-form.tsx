'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { TokenBuilderBasics } from '@/features/token/components/token-builder-basics';
import { TokenBuilderMetadata } from '@/features/token/components/token-builder-metadata';
import {
   TokenBuilderPipeline,
   type StepKey,
   type StepStatus,
} from '@/features/token/components/token-builder-pipeline';
import { TokenBuilderSection } from '@/features/token/components/token-builder-section';
import { TokenBuilderSocialLinks } from '@/features/token/components/token-builder-social-links';
import { tokenFormDefaults, tokenFormSchema, type TokenFormValues } from '@/features/token/lib/token-builder-schema';
import { useTokenActions } from '../hooks';
import { createTokenAmount } from '@solana/client';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';

type ImageMode = 'file' | 'url' | 'none';

const uploadTokenImage = async (file: File) => {
   const payload = new FormData();
   payload.append('file', file);

   const res = await fetch('/api/cloudinary', {
      method: 'POST',
      body: payload,
   });

   const data = await res.json();
   if (!res.ok) {
      throw new Error(data.error || 'Failed to upload image');
   }
   if (!data?.url) {
      throw new Error('Image upload did not return a URL.');
   }

   return data as { url: string };
};

const uploadTokenMetadata = async (values: TokenFormValues, imageUrl?: string) => {
   const res = await fetch('/api/pinata', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         name: values.name,
         symbol: values.symbol,
         decimals: Number(values.decimals),
         description: values.description || undefined,
         image: imageUrl || undefined,
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
   if (!data?.url) {
      throw new Error('Metadata upload did not return a URL.');
   }

   return data as { url: string };
};

export function TokenBuilderForm() {
   const { createToken } = useTokenActions();
   const [stepStatus, setStepStatus] = useState<Record<StepKey, StepStatus>>({
      image: 'pending',
      metadata: 'pending',
      token: 'pending',
   });
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [imageMode, setImageMode] = useState<ImageMode>('none');

   const form = useForm<TokenFormValues>({
      resolver: zodResolver(tokenFormSchema),
      defaultValues: tokenFormDefaults,
      mode: 'onBlur',
   });

   const updateStep = (key: StepKey, status: StepStatus) => {
      setStepStatus(prev => ({ ...prev, [key]: status }));
   };

   const tokenFlow = useMutation({
      mutationFn: async (values: TokenFormValues) => {
         setErrorMessage(null);

         const logoFile = values.logoFile instanceof File ? values.logoFile : null;
         const logoUrl = values.logoUrl?.trim();
         const currentImageMode = logoFile ? 'file' : logoUrl ? 'url' : 'none';
         setImageMode(currentImageMode);

         const imageStepStatus: StepStatus = logoFile ? 'active' : logoUrl ? 'success' : 'skipped';

         setStepStatus({
            image: imageStepStatus,
            metadata: 'pending',
            token: 'pending',
         });

         let imageUrl = logoUrl || undefined;

         if (logoFile) {
            try {
               const imageData = await uploadTokenImage(logoFile);
               imageUrl = imageData.url;
               updateStep('image', 'success');
            } catch (error) {
               updateStep('image', 'error');
               throw error;
            }
         }

         updateStep('metadata', 'active');

         let metadataUrl: string;
         try {
            const metadata = await uploadTokenMetadata(values, imageUrl);
            metadataUrl = metadata.url;
            updateStep('metadata', 'success');
         } catch (error) {
            updateStep('metadata', 'error');
            throw error;
         }

         updateStep('token', 'active');

         try {
            await createToken.mutateAsync({
               name: values.name,
               symbol: values.symbol,
               decimals: Number(values.decimals),
               supply: createTokenAmount(Number(values.decimals)).fromDecimal(values.supply),
               uri: metadataUrl,
            });
            updateStep('token', 'success');
         } catch (error) {
            updateStep('token', 'error');
            throw error;
         }
      },
      onError: error => {
         const message = error instanceof Error ? error.message : 'Something went wrong during token creation.';
         setErrorMessage(message);
      },
   });
   const isSubmitting = tokenFlow.isPending || form.formState.isSubmitting;

   return (
      <Form {...form}>
         <form
            className="space-y-8"
            onSubmit={form.handleSubmit(values => void tokenFlow.mutateAsync(values))}
            noValidate
         >
            <Card className={`${cardShell} relative overflow-hidden`}>
               <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <CardTitle className="text-xl sm:text-2xl">Token Builder</CardTitle>
                        <CardDescription className="hidden sm:block">
                           Create an SPL token with metadata and supply controls.
                        </CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6 sm:space-y-10">
                  <TokenBuilderSection title="Basics" description="Name, symbol, decimals, and supply.">
                     <TokenBuilderBasics />
                  </TokenBuilderSection>
                  <TokenBuilderSection title="Metadata" description="Logo and explorer-ready description.">
                     <TokenBuilderMetadata />
                  </TokenBuilderSection>
                  <TokenBuilderSocialLinks />
                  <TokenBuilderPipeline
                     stepStatus={stepStatus}
                     imageMode={imageMode}
                     isPending={tokenFlow.isPending}
                     errorMessage={errorMessage}
                  />
               </CardContent>
               <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-muted-foreground text-xs">
                     Estimated fee <span className="text-foreground font-semibold">0.1 SOL</span>
                  </div>
                  <Button type="submit" className="md:w-auto" disabled={isSubmitting}>
                     {tokenFlow.isPending ? 'Creating token...' : 'Create token'}
                  </Button>
               </CardFooter>
            </Card>
         </form>
      </Form>
   );
}
