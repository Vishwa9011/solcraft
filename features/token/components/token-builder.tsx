import { TokenBuilderForm } from '@/features/token/components/token-builder-form';
import { TokenBuilderSidecards } from '@/features/token/components/token-builder-sidecards';

export function TokenBuilder() {
   return (
      <div className="space-y-12">
         <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <TokenBuilderForm />
            <TokenBuilderSidecards />
         </section>
      </div>
   );
}
