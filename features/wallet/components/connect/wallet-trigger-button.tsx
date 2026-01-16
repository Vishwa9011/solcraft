'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Loader2, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type WalletTriggerButtonProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'children'> & {
   expanded: boolean;
   controlsId?: string;
   isConnected: boolean;
   connectionLabel: string;
   isConnecting?: boolean;
};

export const WalletTriggerButton = React.forwardRef<HTMLButtonElement, WalletTriggerButtonProps>(
   (
      {
         expanded,
         controlsId,
         isConnected,
         connectionLabel,
         isConnecting = false,
         className,
         variant = 'ghost',
         type = 'button',
         ...props
      },
      ref
   ) => (
      <Button
         ref={ref}
         type={type}
         variant={variant}
         aria-expanded={expanded}
         aria-controls={controlsId}
         className={cn(
            'border-border/60 bg-background/70 hover:bg-accent/50 h-10 rounded-2xl border px-5 shadow-sm',
            className
         )}
         {...props}
      >
         <span className="flex items-center gap-3">
            <Wallet className="text-foreground size-4" />
            <span className={cn('text-sm font-semibold')}>{connectionLabel}</span>
         </span>
         <span className="text-muted-foreground ml-auto flex items-center gap-2">
            {isConnecting && !isConnected ? <Loader2 className="size-4 animate-spin" /> : null}
            {isConnected ? expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" /> : null}
         </span>
      </Button>
   )
);

WalletTriggerButton.displayName = 'WalletTriggerButton';
