'use client';

import { PropsWithChildren } from 'react';
import { SolanaProvider } from '@/features/wallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
   return (
      <SolanaProvider>
         <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SolanaProvider>
   );
}
