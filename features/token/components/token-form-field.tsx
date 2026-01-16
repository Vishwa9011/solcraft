'use client';

import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues, ControllerRenderProps } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const labelClass = 'text-[11px] font-semibold text-muted-foreground';

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
         render={({ field, fieldState }) => {
            const helperText = description;
            return (
               <FormItem className={cn('flex flex-col gap-2', className)}>
                  <div className="flex items-center justify-between gap-3">
                     <FormLabel className={labelClass}>
                        {label} {required ? <span className="text-primary">*</span> : null}
                     </FormLabel>
                     {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
                  </div>
                  <FormControl>{render(field)}</FormControl>
                  {helperText && !fieldState.error ? (
                     <FormDescription className="text-muted-foreground text-xs">{helperText}</FormDescription>
                  ) : null}
                  <FormMessage className="text-xs" />
               </FormItem>
            );
         }}
      />
   );
}
