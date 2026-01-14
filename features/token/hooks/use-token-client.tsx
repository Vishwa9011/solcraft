"use client";
import {
  CreateTokenInstruction,
  getCreateTokenInstructionAsync,
  isSolcraftError,
} from "@/generated/solcraft";
import { createWalletSigner } from "@/features/wallet/utils/wallet-signer";
import {
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
} from "@solana-program/token";
import {
  generateKeyPairSigner,
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  isSolanaError,
  type Address,
} from "@solana/kit";
import { useSendTransaction, useWalletSession } from "@solana/react-hooks";
import { useMutation } from "@tanstack/react-query";

const TOKEN_METADATA_PROGRAM_ADDRESS =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" as Address<"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s">;

export function useTokenClient() {
  const session = useWalletSession();
  const { send } = useSendTransaction();

  let instructions: CreateTokenInstruction;

  const createToken = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("Connect a wallet to initialize the factory.");
      }
      const mint = await generateKeyPairSigner();
      console.log("mint: ", mint.address);

      const signer = createWalletSigner(session);

      const [payer_ata] = await findAssociatedTokenPda({
        owner: signer.address,
        mint: mint.address,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });

      const [metadata] = await getProgramDerivedAddress({
        programAddress: TOKEN_METADATA_PROGRAM_ADDRESS,
        seeds: [
          getBytesEncoder().encode(new TextEncoder().encode("metadata")),
          getAddressEncoder().encode(TOKEN_METADATA_PROGRAM_ADDRESS),
          getAddressEncoder().encode(mint.address),
        ],
      });

      instructions = await getCreateTokenInstructionAsync({
        name: "Test",
        symbol: "Test",
        uri: "https://example.com",
        decimals: 6,
        mint: mint,
        payer: signer,
        supply: 1000000,
        payerAta: payer_ata,
        metadata,
      });

      await send({
        instructions: [instructions],
        feePayer: signer,
        authority: signer,
        commitment: "confirmed",
      });
    },

    onError: (error) => {
      if (
        isSolcraftError(error, {
          instructions: [instructions],
        })
      ) {
        console.error("Solcraft Error: ", error.context.code, error.message);
      }

      if (isSolanaError(error)) {
        console.log("error: ", error.cause);
        console.log("error: ", error.context);
        console.log("error: ", error.message);
        console.log("error: ", error.name);

        console.error("Solana Error: ", error.message);
      } else {
        console.error("Error: ", error);
      }
    },
  });

  return { createToken };
}
