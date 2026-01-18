import {
   fetchMaybeFactoryConfig,
   getInitializeFactoryInstructionAsync,
   getPauseFactoryInstructionAsync,
   getUnpauseFactoryInstructionAsync,
   getUpdateCreationFeeInstructionAsync,
   getWithdrawFeesInstructionAsync,
   SOLCRAFT_PROGRAM_ADDRESS,
} from '@/generated/solcraft';
import { lamportsFromSol } from '@solana/client';
import { getProgramDerivedAddress, type TransactionSigner } from '@solana/kit';
import { useSendTransaction } from '@solana/react-hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/app/providers';
import { client, useTransactionToast, useWalletSigner } from '@/features/wallet';
import { queryKeys } from '@/lib';
import { handleProgramError } from '@/lib/errors';

const FACTORY_SEED = 'factory_config';
const WALLET_REQUIRED_MESSAGE = 'Connect a wallet to manage the factory.';
const DEFAULT_CREATION_FEE_SOL = '0.1';

let factoryPdaCache: Awaited<ReturnType<typeof getProgramDerivedAddress>>[0] | null = null;

function requireSigner(signer: TransactionSigner | null) {
   if (!signer) {
      throw new Error(WALLET_REQUIRED_MESSAGE);
   }

   return signer;
}

async function getFactoryPDA() {
   if (factoryPdaCache) {
      return factoryPdaCache;
   }

   const [pda] = await getProgramDerivedAddress({
      programAddress: SOLCRAFT_PROGRAM_ADDRESS,
      seeds: [Buffer.from(FACTORY_SEED)],
   });

   factoryPdaCache = pda;
   return pda;
}

export function useFactoryActions() {
   const signer = useWalletSigner();
   const { send } = useSendTransaction();
   const { notifySuccess } = useTransactionToast();

   type SendArgs = Parameters<typeof send>[0];
   type Instruction = SendArgs['instructions'][number];

   const refreshFactoryConfig = () =>
      queryClient.invalidateQueries({
         queryKey: queryKeys.factoryConfig.all,
      });

   const sendAdminInstruction = async (builder: (walletSigner: TransactionSigner) => Promise<Instruction>) => {
      const walletSigner = requireSigner(signer);
      const instruction = await builder(walletSigner);

      return await send({
         instructions: [instruction],
         authority: walletSigner,
         feePayer: walletSigner,
         commitment: 'confirmed',
      });
   };

   const factoryConfig = useQuery({
      queryKey: queryKeys.factoryConfig.all,
      queryFn: async () => {
         const pda = await getFactoryPDA();
         const res = await fetchMaybeFactoryConfig(client.runtime.rpc, pda);

         return {
            exists: res.exists,
            data: res.exists ? res.data : null,
            address: res.address,
         };
      },
   });

   const initialize = useMutation({
      mutationFn: async () =>
         sendAdminInstruction(walletSigner =>
            getInitializeFactoryInstructionAsync({
               admin: walletSigner,
               creationFeeLamports: lamportsFromSol(DEFAULT_CREATION_FEE_SOL),
            })
         ),
      onError: error => {
         handleProgramError(error, 'Failed to initialize factory');
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Factory initialized', signature });
         refreshFactoryConfig();
      },
   });

   const pause = useMutation({
      mutationFn: async () =>
         sendAdminInstruction(walletSigner =>
            getPauseFactoryInstructionAsync({
               admin: walletSigner,
            })
         ),
      onError: error => {
         handleProgramError(error, 'Failed to pause factory');
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Factory paused', signature });
         refreshFactoryConfig();
      },
   });

   const unpause = useMutation({
      mutationFn: async () =>
         sendAdminInstruction(walletSigner =>
            getUnpauseFactoryInstructionAsync({
               admin: walletSigner,
            })
         ),
      onError: error => {
         handleProgramError(error, 'Failed to unpause factory');
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Factory unpaused', signature });
         refreshFactoryConfig();
      },
   });

   const updateCreationFee = useMutation({
      mutationFn: async (newFeeSol: number) =>
         sendAdminInstruction(walletSigner =>
            getUpdateCreationFeeInstructionAsync({
               admin: walletSigner,
               creationFeeLamports: lamportsFromSol(newFeeSol),
            })
         ),
      onError: error => {
         handleProgramError(error, 'Failed to update creation fee');
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Creation fee updated', signature });
         refreshFactoryConfig();
      },
   });

   const withdrawFees = useMutation({
      mutationFn: async () =>
         sendAdminInstruction(walletSigner =>
            getWithdrawFeesInstructionAsync({
               admin: walletSigner,
            })
         ),
      onError: error => {
         handleProgramError(error, 'Failed to withdraw fees');
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Fees withdrawn', signature });
         refreshFactoryConfig();
      },
   });

   return {
      factoryConfig,
      initialize,
      pause,
      unpause,
      updateCreationFee,
      withdrawFees,
   };
}
