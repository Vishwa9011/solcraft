import { getSolcraftErrorMessage } from '@/generated/solcraft';
import { isSolanaError, SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE } from '@solana/kit';
import { toast } from 'sonner';

export function resolveProgramError(error: any, fallbackMessage = 'An unknown error occurred') {
   if (isSolanaError(error)) {
      const ctx = error.context;
      if (ctx?.__code === SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE) {
         return `Number is too large. Max is ${ctx.max.toString()}.`;
      }
      const errCode = Object.getOwnPropertyDescriptors((error.cause as any)?.cause).context.value.code;
      return getSolcraftErrorMessage(errCode);
   }

   if ('cause' in error) {
      const cause = error.cause as any;
      return cause;
   }

   return error.message ?? fallbackMessage;
}

export const handleProgramError = (error: any, fallbackMessage = 'An unknown error occurred') => {
   const message = resolveProgramError(error, fallbackMessage);
   toast.error(message);
};
