'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { TokenFormField } from '@/features/token/components/token-form-field';
import { type TokenFormValues } from '@/features/token/lib/token-builder-schema';

export function TokenBuilderBasics() {
   const { control } = useFormContext<TokenFormValues>();

   return (
      <div className="grid items-start gap-4 md:grid-cols-2">
         <TokenFormField
            control={control}
            name="name"
            label="Token name (max 30)"
            required
            render={field => <Input placeholder="My awesome token" {...field} />}
         />
         <TokenFormField
            control={control}
            name="symbol"
            label="Token symbol (max 10)"
            required
            render={field => (
               <Input
                  placeholder="AWESOME"
                  className="tracking-[0.2em]"
                  autoCapitalize="characters"
                  {...field}
                  onChange={event => field.onChange(event.target.value.toUpperCase())}
               />
            )}
         />
         <TokenFormField
            control={control}
            name="decimals"
            label="Decimals"
            required
            description="Standard SPL tokens use 9 decimals."
            render={field => <Input type="number" min={0} max={9} inputMode="numeric" placeholder="9" {...field} />}
         />
         <TokenFormField
            control={control}
            name="supply"
            label="Supply"
            required
            description="Initial supply minted to your wallet."
            render={field => <Input type="number" min={1} inputMode="numeric" placeholder="1000000" {...field} />}
         />
      </div>
   );
}
