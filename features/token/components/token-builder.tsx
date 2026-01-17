import { TokenBuilderForm } from '@/features/token/components/token-builder-form';
import { TokenBuilderSidecards } from '@/features/token/components/token-builder-sidecards';

export function TokenBuilder() {
   return (
      <div className="w-full space-y-10">
         <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <TokenBuilderForm />
            <TokenBuilderSidecards />
         </section>
      </div>
   );
}
