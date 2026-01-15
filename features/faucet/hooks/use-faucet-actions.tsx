import { useWalletSigner } from '@/features/wallet';
import {
   getClaimFromFaucetInstructionAsync,
   getDepositToFaucetInstructionAsync,
   getInitializeFaucetInstructionAsync,
   getWithdrawFromFaucetInstructionAsync,
} from '@/generated/solcraft';
import { Address, Instruction } from '@solana/kit';
import { useSendTransaction } from '@solana/react-hooks';
import { TransactionSigner } from '@solana/signers';
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export type InitializeFaucetParams = {
   mint: Address<string>;
};

export type DepositToFaucetParams = {
   amount: number;
   mint: Address;
   factoryConfig: Address;
};

export function useFaucetActions() {
   const { send } = useSendTransaction();
   const signer = useWalletSigner();

   const sendTransaction = async (builder: (signer: TransactionSigner) => Promise<Instruction>) => {
      if (!signer) {
         throw new Error('Wallet not connected');
      }

      const instruction = await builder(signer);

      return await send({
         instructions: [instruction],
         feePayer: signer,
         authority: signer,
         commitment: 'confirmed',
      });
   };

   const initialize = useMutation({
      mutationFn: async ({ mint }: InitializeFaucetParams) => {
         return await sendTransaction(signer =>
            getInitializeFaucetInstructionAsync({
               mint,
               owner: signer,
            })
         );
      },
      onError: error => {
         toast.error(`Failed to initialize faucet: ${error instanceof Error ? error.message : String(error)}`);
      },
      onSuccess: () => {
         toast.success('Faucet initialized successfully');
      },
   });

   const deposit = useMutation({
      mutationFn: async (params: DepositToFaucetParams) => {
         if (!signer) {
            throw new Error('Wallet not connected');
         }

         const [treasuryPda] = await findAssociatedTokenPda({
            owner: params.factoryConfig,
            mint: params.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });
         const [depositorAta] = await findAssociatedTokenPda({
            owner: signer.address,
            mint: params.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         return await sendTransaction(signer =>
            getDepositToFaucetInstructionAsync({
               amount: BigInt(params.amount),
               depositor: signer,
               treasuryAta: treasuryPda,
               depositorAta: depositorAta,
            })
         );
      },
   });

   const withdraw = useMutation({
      mutationFn: async (params: DepositToFaucetParams) => {
         if (!signer) {
            throw new Error('Wallet not connected');
         }

         const [treasuryAta] = await findAssociatedTokenPda({
            owner: params.factoryConfig,
            mint: params.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });
         const [recipientAta] = await findAssociatedTokenPda({
            owner: signer.address,
            mint: params.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         return await sendTransaction(signer =>
            getWithdrawFromFaucetInstructionAsync({
               amount: BigInt(0), // specify amount
               recipient: signer,
               recipientAta,
               treasuryAta,
            })
         );
      },
   });

   const claim = useMutation({
      mutationFn: async (params: Partial<DepositToFaucetParams>) => {
         if (!signer) {
            throw new Error('Wallet not connected');
         }
         const [treasuryAta] = await findAssociatedTokenPda({
            owner: params.factoryConfig!,
            mint: params.mint!,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         const [recipientAta] = await findAssociatedTokenPda({
            owner: signer!.address,
            mint: params.mint!,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         return await sendTransaction(async signer =>
            getClaimFromFaucetInstructionAsync({
               recipient: signer,
               treasuryAta,
               recipientAta,
            })
         );
      },
   });

   return {
      initialize,
      deposit,
      withdraw,
      claim,
   };
}
