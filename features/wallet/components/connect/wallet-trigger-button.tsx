'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
         className={cn(className)}
         {...props}
      >
         <span className="flex items-center gap-3">
            <Wallet className="text-foreground size-4" />
            <span className={cn('text-sm font-semibold')}>{connectionLabel}</span>
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
