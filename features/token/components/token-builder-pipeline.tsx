'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2, MinusCircle, XCircle } from 'lucide-react';

export type StepKey = 'image' | 'metadata' | 'token';
export type StepStatus = 'pending' | 'active' | 'success' | 'error' | 'skipped';

const statusLabels: Record<StepStatus, string> = {
   pending: 'Waiting',
   active: 'In progress',
   success: 'Done',
   error: 'Failed',
   skipped: 'Skipped',
};

type TokenBuilderPipelineProps = {
   stepStatus: Record<StepKey, StepStatus>;
   imageMode: 'file' | 'url' | 'none';
   isPending: boolean;
   errorMessage: string | null;
};

export function TokenBuilderPipeline({ stepStatus, imageMode, isPending, errorMessage }: TokenBuilderPipelineProps) {
   const steps = useMemo(
      () => [
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
      ],
      [imageMode]
   );

   const pipelineState = useMemo(() => {
      if (errorMessage) {
         return { label: 'Needs attention', variant: 'destructive' as const };
      }
      if (isPending) {
         return { label: 'In progress', variant: 'default' as const };
      }
      const complete = Object.values(stepStatus).every(status => status === 'success' || status === 'skipped');
      return complete
         ? { label: 'Complete', variant: 'secondary' as const }
         : { label: 'Ready', variant: 'outline' as const };
   }, [errorMessage, isPending, stepStatus]);

   return (
      <div className="space-y-4">
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

               return (
                  <div
                     key={step.key}
                     className={cn(
                        'flex items-start gap-3 rounded-xl px-3 py-2',
                        status === 'active' && 'bg-primary/5'
                     )}
                  >
                     <Icon
                        className={cn(
                           'text-muted-foreground mt-0.5 size-4',
                           status === 'active' && 'text-primary animate-spin',
                           status === 'success' && 'text-primary',
                           status === 'error' && 'text-destructive',
                           status === 'skipped' && 'text-muted-foreground'
                        )}
                     />
                     <div className="space-y-1">
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="text-muted-foreground text-xs">{step.description}</p>
                        <p className="text-muted-foreground text-xs">{statusLabels[status]}</p>
                     </div>
                  </div>
               );
            })}
         </div>
         {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}
      </div>
   );
}
