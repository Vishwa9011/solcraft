import { getSolcraftErrorMessage } from '@/generated/solcraft';
import { isSolanaError } from '@solana/kit';
import { toast } from 'sonner';

export function resolveProgramError(error: any, fallbackMessage = 'An unknown error occurred') {
   if (isSolanaError(error)) {
      const errCode = Object.getOwnPropertyDescriptors((error.cause as any)?.cause).context.value.code;
      return getSolcraftErrorMessage(errCode);
   }

   return error.message ?? fallbackMessage;
}

export const handleProgramError = (error: any, fallbackMessage = 'An unknown error occurred') => {
   const message = resolveProgramError(error, fallbackMessage);
   toast.error(message);
};
