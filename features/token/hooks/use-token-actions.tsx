"use client";

import { toast } from "sonner";
import { useWalletSigner } from "@/features/wallet";
import { type TransactionSigner } from "@solana/kit";
import { useSendTransaction } from "@solana/react-hooks";
import { useMutation } from "@tanstack/react-query";
import {
  buildCreateTokenInstruction,
  buildMintTokensInstruction,
  buildTransferFreezeAuthorityInstruction,
  buildTransferMintAuthorityInstruction,
  CreateTokenParams,
  type MintTokensParams,
  type TransferAuthorityParams,
} from "@/features/token/lib";

const WALLET_REQUIRED_MESSAGE = "Connect a wallet to initialize the factory.";

function requireSigner(signer: TransactionSigner | null) {
  if (!signer) {
    throw new Error(WALLET_REQUIRED_MESSAGE);
  }

  return signer;
}

export function useTokenActions() {
  const signer = useWalletSigner();
  const { send } = useSendTransaction();

  const createToken = useMutation({
    mutationFn: async (params: CreateTokenParams) => {
      const walletSigner = requireSigner(signer);
      const instructions = await buildCreateTokenInstruction(
        walletSigner,
        params
      );
      return await send({
        instructions: [instructions],
        feePayer: walletSigner,
        authority: walletSigner,
        commitment: "confirmed",
      });
    },

    onSuccess: (data) => {
      console.log("Token created successfully. Transaction signature:", data);
    },

    onError: (error) => {
      toast.error(`Error creating token`);
    },
  });

  const mintTokens = useMutation({
    mutationFn: async ({ mint, amount }: MintTokensParams) => {
      const walletSigner = requireSigner(signer);
      const instructions = await buildMintTokensInstruction(walletSigner, {
        mint,
        amount,
      });

      return await send({
        instructions: [instructions],
        feePayer: walletSigner,
        commitment: "confirmed",
      });
    },
    onSuccess: (data) => {
      toast.success(`Tokens minted successfully. Tx: ${data}`);
    },
    onError: (error) => {
      toast.error(`Error minting tokens: ${error.message}`);
    },
  });

  const transferOrRevokeFreezeAuthority = useMutation({
    mutationFn: async (params: TransferAuthorityParams) => {
      const walletSigner = requireSigner(signer);
      const instructions = buildTransferFreezeAuthorityInstruction(
        walletSigner,
        params
      );

      return await send({
        instructions: [instructions],
        feePayer: walletSigner,
        commitment: "confirmed",
      });
    },
    onSuccess: (data) => {
      toast.success(`Authority updated successfully. Tx: ${data}`);
    },
    onError: (error) => {
      toast.error(`Error updating authority: ${error.message}`);
    },
  });

  const transferOrRevokeMintAuthority = useMutation({
    mutationFn: async (params: TransferAuthorityParams) => {
      const walletSigner = requireSigner(signer);
      const instructions = buildTransferMintAuthorityInstruction(
        walletSigner,
        params
      );

      return await send({
        instructions: [instructions],
        feePayer: walletSigner,
        commitment: "confirmed",
      });
    },
    onSuccess: (data) => {
      toast.success(`Authority updated successfully. Tx: ${data}`);
    },
    onError: (error) => {
      toast.error(`Error updating authority: ${error.message}`);
    },
  });

  return {
    createToken,
    mintTokens,
    transferOrRevokeFreezeAuthority,
    transferOrRevokeMintAuthority,
  };
}
