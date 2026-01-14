import {
  fetchMaybeFactoryConfig,
  getInitializeFactoryInstructionAsync,
  SOLCRAFT_PROGRAM_ADDRESS,
} from "@/generated/solcraft";
import { createWalletSigner, rpc, useWalletSigner } from "@/features/wallet";
import { lamportsFromSol } from "@solana/client";
import { getProgramDerivedAddress } from "@solana/kit";
import { useSendTransaction, useWalletSession } from "@solana/react-hooks";
import { useMutation, useQuery } from "@tanstack/react-query";

async function getFactoryPDA() {
  const [pda] = await getProgramDerivedAddress({
    programAddress: SOLCRAFT_PROGRAM_ADDRESS,
    seeds: [Buffer.from("factory_config")],
  });

  return pda;
}

export function useFactoryClient() {
  const signer = useWalletSigner();
  const { send } = useSendTransaction();

  const factoryConfig = useQuery({
    queryKey: ["factory-config-pda"],
    queryFn: async () => {
      const pda = await getFactoryPDA();
      return await fetchMaybeFactoryConfig(rpc, pda);
    },
  });

  const initializeFactory = useMutation({
    mutationFn: async () => {
      if (!signer) {
        throw new Error("Connect a wallet to initialize the factory.");
      }

      const instruction = await getInitializeFactoryInstructionAsync({
        admin: signer,
        creationFeeLamports: lamportsFromSol("0.1"),
      });
      console.log("instruction: ", instruction);

      const signature = await send({
        instructions: [instruction],
        authority: signer,
        feePayer: signer,
        commitment: "confirmed",
      });
      console.log("signature: ", signature);

      return signature;
    },

    onError: (error) => {
      console.log("Failed to initialize factory:", error);
    },

    onSuccess: (data) => {
      console.log(
        "Factory initialized successfully. Transaction signature:",
        data
      );
    },
  });

  return {
    factoryConfig,
    initializeFactory,
  };
}
