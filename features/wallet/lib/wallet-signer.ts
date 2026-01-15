import { getBase58Encoder } from '@solana/codecs-strings';
import type { WalletSession } from '@solana/client';
import { signatureBytes } from '@solana/keys';
import type { SendableTransaction, Transaction } from '@solana/transactions';
import type { TransactionPartialSigner, TransactionSendingSigner, TransactionSigner } from '@solana/kit';

const base58Encoder = getBase58Encoder();

function getSignature(transaction: Transaction, address: WalletSession['account']['address']) {
   const signature = transaction.signatures[address as keyof typeof transaction.signatures];
   if (!signature) {
      throw new Error('Wallet did not return a signature for the fee payer.');
   }
   return signature;
}

function toWalletTransaction(transaction: Transaction): SendableTransaction & Transaction {
   return transaction as SendableTransaction & Transaction;
}

export function createWalletSigner(session: WalletSession): TransactionSigner {
   if (session.signTransaction) {
      const signer: TransactionPartialSigner = {
         address: session.account.address,
         signTransactions: async (transactions, config) => {
            config?.abortSignal?.throwIfAborted();
            const signed = await Promise.all(
               transactions.map(transaction => session.signTransaction!(toWalletTransaction(transaction)))
            );
            return signed.map(transaction => ({
               [session.account.address]: getSignature(transaction, session.account.address),
            }));
         },
      };
      return signer;
   }

   if (session.sendTransaction) {
      const signer: TransactionSendingSigner = {
         address: session.account.address,
         signAndSendTransactions: async transactions => {
            const signatures = await Promise.all(
               transactions.map(transaction => session.sendTransaction!(toWalletTransaction(transaction)))
            );
            return signatures.map(signature => signatureBytes(base58Encoder.encode(signature)));
         },
      };
      return signer;
   }

   throw new Error('Connected wallet does not support signing transactions.');
}
