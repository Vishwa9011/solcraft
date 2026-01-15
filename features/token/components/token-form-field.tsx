'use client';

import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues, ControllerRenderProps } from 'react-hook-form';
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground';

type TokenFormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   required?: boolean;
   description?: string;
   className?: string;
   actions?: ReactNode;
   render: (field: ControllerRenderProps<TFieldValues, TName>) => ReactNode;
};

export function TokenFormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
   control,
   name,
   label,
   required,
   description,
   className,
   actions,
   render,
}: TokenFormFieldProps<TFieldValues, TName>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field, fieldState }) => (
            <FormItem className={className}>
               {actions ? (
                  <div className="flex items-center justify-between gap-3">
                     <FormLabel className={labelClass}>
                        {label} {required ? <span className="text-primary">*</span> : null}
                     </FormLabel>
                     <div className="flex items-center gap-2">{actions}</div>
                  </div>
               ) : (
                  <FormLabel className={labelClass}>
                     {label} {required ? <span className="text-primary">*</span> : null}
                  </FormLabel>
               )}
               <FormControl>{render(field)}</FormControl>
               {description && !fieldState.error ? (
                  <FormDescription className="text-xs">{description}</FormDescription>
               ) : null}
               <FormMessage className="text-xs" />
            </FormItem>
         )}
      />
   );
}
