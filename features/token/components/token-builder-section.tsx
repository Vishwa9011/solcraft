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

export function TokenBuilderSection({
   title,
   description,
   actions,
   className,
   children,
}: TokenBuilderSectionProps) {
   return (
      <section className={cn('space-y-4', className)}>
         <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
               <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{title}</p>
               {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
         </div>
         {children}
      </section>
   );
}
