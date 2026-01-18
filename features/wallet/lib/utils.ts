import { TransactionSigner } from '@solana/signers';

const WALLET_REQUIRED_MESSAGE = 'Connect a wallet to use the faucet.';
export function requireSigner(signer: TransactionSigner | null) {
   if (!signer) {
      throw new Error(WALLET_REQUIRED_MESSAGE);
   }

   return signer;
}
