'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type WalletTriggerButtonProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'children'> & {
   expanded: boolean;
   controlsId?: string;
   isConnected: boolean;
   connectionLabel: string;
};

export const WalletTriggerButton = React.forwardRef<HTMLButtonElement, WalletTriggerButtonProps>(
   (
      { expanded, controlsId, isConnected, connectionLabel, className, variant = 'outline', type = 'button', ...props },
      ref
   ) => (
      <Button
         ref={ref}
         type={type}
         variant={variant}
         aria-expanded={expanded}
         aria-controls={controlsId}
         className={cn(
            'group border-border/60 bg-card/60 hover:border-border/80 hover:bg-card/80 relative h-10 w-full max-w-sm overflow-hidden rounded-xl px-3 text-left shadow-sm transition',
            isConnected ? 'justify-between' : 'justify-start',
            className
         )}
         {...props}
      >
         <span className="relative flex items-center gap-3">
            <span
               className={cn(
                  'border-border/50 bg-background/70 text-muted-foreground group-hover:border-border/80 flex size-8 items-center justify-center rounded-lg border transition',
                  isConnected && 'text-primary'
               )}
            >
               <Wallet className="size-4" />
            </span>
            <span className={cn('flex', isConnected ? 'flex-col' : 'items-center')}>
               <span className="text-foreground text-sm font-semibold">{connectionLabel}</span>
               {isConnected ? <span className="text-muted-foreground text-xs">Wallet connected</span> : null}
            </span>
         </span>
         {isConnected ? (
            <span className="text-muted-foreground relative flex items-center">
               {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </span>
         ) : null}
      </Button>
   )
);

WalletTriggerButton.displayName = 'WalletTriggerButton';
