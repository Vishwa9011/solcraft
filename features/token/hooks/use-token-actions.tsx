'use client';

import { client, useTransactionToast, useWalletSigner } from '@/features/wallet';
import { address, type TransactionSigner } from '@solana/kit';

import { useSendTransaction } from '@solana/react-hooks';
import { useMutation } from '@tanstack/react-query';
import {
   buildCreateTokenInstruction,
   buildMintTokensInstruction,
   buildTransferMintAuthorityInstruction,
   CreateTokenParams,
   type MintTokensParams,
   type TransferAuthorityParams,
} from '@/features/token/lib';
import { fetchMint } from '@solana-program/token';
import { handleProgramError } from '@/lib/errors';

const WALLET_REQUIRED_MESSAGE = 'Connect a wallet to initialize the factory.';

function requireSigner(signer: TransactionSigner | null) {
   if (!signer) {
      throw new Error(WALLET_REQUIRED_MESSAGE);
   }

   return signer;
}

export function useTokenActions() {
   const signer = useWalletSigner();
   const { send } = useSendTransaction();
   const { notifySuccess } = useTransactionToast();

   const createToken = useMutation({
      mutationFn: async (params: CreateTokenParams) => {
         const walletSigner = requireSigner(signer);
         const instructions = await buildCreateTokenInstruction(walletSigner, params);
         return await send({
            instructions: [instructions],
            feePayer: walletSigner,
            authority: walletSigner,
            commitment: 'confirmed',
         });
      },

      onSuccess: signature => {
         notifySuccess({ title: 'Token created', signature });
      },

      onError: e => handleProgramError(e, 'Error creating token'),
   });

   const mintTokens = useMutation({
      mutationFn: async ({ mint, amount }: MintTokensParams) => {
         const walletSigner = requireSigner(signer);
         const mintInfo = await fetchMint(client.runtime.rpc, address(mint));

         const instructions = await buildMintTokensInstruction(walletSigner, {
            mint,
            amount: BigInt(amount) * BigInt(10 ** mintInfo.data.decimals),
         });

         return await send({
            instructions: [instructions],
            feePayer: walletSigner,
            commitment: 'confirmed',
         });
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Tokens minted', signature });
      },
      onError: error => {
         handleProgramError(error, 'Error minting tokens');
      },
   });

   const transferOrRevokeMintAuthority = useMutation({
      mutationFn: async (params: TransferAuthorityParams) => {
         const walletSigner = requireSigner(signer);
         const instructions = buildTransferMintAuthorityInstruction(walletSigner, params);

         return await send({
            instructions: [instructions],
            feePayer: walletSigner,
            commitment: 'confirmed',
         });
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Authority updated', signature });
      },
      onError: error => {
         handleProgramError(error, 'Error updating authority');
      },
   });

   return {
      createToken,
      mintTokens,
      transferOrRevokeMintAuthority,
   };
}
