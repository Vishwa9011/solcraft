'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TokenBuilderSectionProps = {
   title: string;
   description?: string;
   actions?: ReactNode;
   className?: string;
   children: ReactNode;
};

export function TokenBuilderSection({ title, description, actions, className, children }: TokenBuilderSectionProps) {
   return (
      <section className={cn('space-y-3 sm:space-y-4', className)}>
         <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
               <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase sm:text-xs">{title}</p>
               {description ? <p className="text-muted-foreground text-xs sm:text-sm">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
         </div>
         {children}
      </section>
   );
}
