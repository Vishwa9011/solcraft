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
      { expanded, controlsId, isConnected, connectionLabel, className, variant = 'ghost', type = 'button', ...props },
      ref
   ) => (
      <Button
         ref={ref}
         type={type}
         variant={variant}
         aria-expanded={expanded}
         aria-controls={controlsId}
         className={cn(
            'group focus-visible:ring-ring relative flex w-full items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2',
            isConnected
               ? 'border-border/40 bg-card/70 text-foreground hover:border-primary/60 hover:bg-card/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
               : 'bg-foreground text-background hover:bg-foreground/95 border-transparent shadow-[0_25px_40px_rgba(0,0,0,0.55)]',
            className
         )}
         {...props}
      >
         <span className="flex items-center gap-3">
            <span className="border-border/40 bg-background/70 text-muted-foreground group-hover:border-border/80 flex h-9 w-9 items-center justify-center rounded-2xl border">
               <Wallet className="text-foreground size-4" />
            </span>
            <div className="flex flex-col text-left">
               <span className={cn('text-sm font-semibold', isConnected ? 'text-foreground' : 'text-background')}>
                  {connectionLabel}
               </span>
            </div>
         </span>
         {isConnected ? (
            <span className="text-muted-foreground ml-auto">
               {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </span>
         ) : null}
      </Button>
   )
);

WalletTriggerButton.displayName = 'WalletTriggerButton';
