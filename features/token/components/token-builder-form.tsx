'use client';

import { useState } from 'react';
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
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2, MinusCircle, XCircle } from 'lucide-react';
import { useTokenActions } from '../hooks';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';

type StepKey = 'image' | 'metadata' | 'token';
type StepStatus = 'pending' | 'active' | 'success' | 'error' | 'skipped';

const statusLabels: Record<StepStatus, string> = {
   pending: 'Waiting',
   active: 'In progress',
   success: 'Done',
   error: 'Failed',
   skipped: 'Skipped',
};

export function TokenBuilderForm() {
   const { createToken } = useTokenActions();
   const [stepStatus, setStepStatus] = useState<Record<StepKey, StepStatus>>({
      image: 'pending',
      metadata: 'pending',
      token: 'pending',
   });
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [imageMode, setImageMode] = useState<'file' | 'url' | 'none'>('none');

   const form = useForm<TokenFormValues>({
      resolver: zodResolver(tokenFormSchema),
      defaultValues: tokenFormDefaults,
      mode: 'onBlur',
   });

   const updateStep = (key: StepKey, status: StepStatus) => {
      setStepStatus(prev => ({ ...prev, [key]: status }));
   };

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
               supply: Number(values.supply),
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

   const steps = [
      {
         key: 'image' as const,
         title: 'Upload image',
         description:
            imageMode === 'file'
               ? 'Uploading to Cloudinary'
               : imageMode === 'url'
                 ? 'Using provided URL'
                 : 'No logo selected yet',
      },
      {
         key: 'metadata' as const,
         title: 'Upload metadata',
         description: 'Pinning metadata to IPFS',
      },
      {
         key: 'token' as const,
         title: 'Create token',
         description: 'Submitting transaction',
      },
   ];

   const pipelineState = (() => {
      if (errorMessage) {
         return { label: 'Needs attention', variant: 'destructive' as const };
      }
      if (tokenFlow.isPending) {
         return { label: 'In progress', variant: 'default' as const };
      }
      const complete = Object.values(stepStatus).every(status => status === 'success' || status === 'skipped');
      return complete
         ? { label: 'Complete', variant: 'secondary' as const }
         : { label: 'Ready', variant: 'outline' as const };
   })();

   return (
      <Form {...form}>
         <form className="space-y-8" onSubmit={form.handleSubmit(values => tokenFlow.mutateAsync(values))} noValidate>
            <Card className={`${cardShell} relative overflow-hidden`}>
               <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle>Token Builder</CardTitle>
                        <CardDescription>Create an SPL token with metadata and supply controls.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6">
                  <TokenBuilderBasics />
                  <TokenBuilderMetadata />
                  <Separator />
                  <TokenBuilderSocialLinks />
                  <div className="border-border/60 bg-muted/20 space-y-4 rounded-2xl border p-4">
                     <div className="flex items-center justify-between gap-3">
                        <div>
                           <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Creation pipeline</p>
                           <p className="text-muted-foreground text-sm">Your token is built step by step.</p>
                        </div>
                        <Badge variant={pipelineState.variant}>{pipelineState.label}</Badge>
                     </div>
                     <div className="grid gap-3 md:grid-cols-3">
                        {steps.map(step => {
                           const status = stepStatus[step.key];
                           const Icon =
                              status === 'active'
                                 ? Loader2
                                 : status === 'success'
                                   ? CheckCircle2
                                   : status === 'error'
                                     ? XCircle
                                     : status === 'skipped'
                                       ? MinusCircle
                                       : Circle;
                           const badgeVariant =
                              status === 'error'
                                 ? 'destructive'
                                 : status === 'active'
                                   ? 'default'
                                   : status === 'success'
                                     ? 'secondary'
                                     : 'outline';

                           return (
                              <div
                                 key={step.key}
                                 className={cn(
                                    'border-border/40 bg-background/40 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2',
                                    status === 'active' && 'border-primary/40 bg-primary/5'
                                 )}
                              >
                                 <div className="flex items-center gap-3">
                                    <Icon
                                       className={cn(
                                          'text-muted-foreground size-4',
                                          status === 'active' && 'text-primary animate-spin',
                                          status === 'success' && 'text-primary',
                                          status === 'error' && 'text-destructive',
                                          status === 'skipped' && 'text-muted-foreground'
                                       )}
                                    />
                                    <div>
                                       <p className="text-sm font-semibold">{step.title}</p>
                                       <p className="text-muted-foreground text-xs">{step.description}</p>
                                    </div>
                                 </div>
                                 <Badge variant={badgeVariant}>{statusLabels[status]}</Badge>
                              </div>
                           );
                        })}
                     </div>
                     {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                     <div className="text-muted-foreground text-xs">
                        Estimated fee <span className="text-foreground font-semibold">0.1 SOL</span>
                     </div>
                     <Button
                        type="submit"
                        className="md:w-auto"
                        disabled={form.formState.isSubmitting || tokenFlow.isPending}
                     >
                        {tokenFlow.isPending ? 'Creating token...' : 'Create token'}
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </form>
      </Form>
   );
}
