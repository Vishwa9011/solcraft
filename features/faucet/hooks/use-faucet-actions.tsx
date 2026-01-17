import { queryClient } from '@/app/providers';
import { client, useTransactionToast, useWalletSigner } from '@/features/wallet';
import {
   fetchMaybeFaucetConfig,
   fetchMaybeFaucetRecipientData,
   getClaimFromFaucetInstructionAsync,
   getDepositToFaucetInstructionAsync,
   getInitializeFaucetInstructionAsync,
   getWithdrawFromFaucetInstructionAsync,
   SOLCRAFT_PROGRAM_ADDRESS,
} from '@/generated/solcraft';
import { queryKeys } from '@/lib';
import { address, Address, getAddressEncoder, getProgramDerivedAddress, type TransactionSigner } from '@solana/kit';
import { useSendTransaction } from '@solana/react-hooks';
import {
   fetchMint,
   findAssociatedTokenPda,
   getCreateAssociatedTokenIdempotentInstructionAsync,
   TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTokenAmount } from '@solana/client';

export type InitializeFaucetParams = {
   mint: string;
};

export type FaucetAmountParams = {
   amount: string;
};

const FAUCET_CONFIG_SEED = 'faucet_config';
const FAUCET_RECIPIENT_SEED = 'faucet_recipient';
const WALLET_REQUIRED_MESSAGE = 'Connect a wallet to use the faucet.';

let faucetPdaCache: Awaited<ReturnType<typeof getProgramDerivedAddress>>[0] | null = null;
const recipientPdaCache = new Map<string, Address>();

function resolveErrorMessage(error: unknown, fallback: string) {
   if (error instanceof Error && error.message) {
      return `${fallback}: ${error.message}`;
   }

   return fallback;
}

function requireSigner(signer: TransactionSigner | null) {
   if (!signer) {
      throw new Error(WALLET_REQUIRED_MESSAGE);
   }

   return signer;
}

async function getFaucetConfigPda() {
   if (faucetPdaCache) {
      return faucetPdaCache;
   }

   const [pda] = await getProgramDerivedAddress({
      programAddress: SOLCRAFT_PROGRAM_ADDRESS,
      seeds: [Buffer.from(FAUCET_CONFIG_SEED)],
   });

   faucetPdaCache = pda;
   return pda;
}

async function getRecipientDataPda(recipient: Address) {
   const cacheKey = recipient.toString();
   const cached = recipientPdaCache.get(cacheKey);
   if (cached) {
      return cached;
   }

   const [pda] = await getProgramDerivedAddress({
      programAddress: SOLCRAFT_PROGRAM_ADDRESS,
      seeds: [Buffer.from(FAUCET_RECIPIENT_SEED), getAddressEncoder().encode(recipient)],
   });

   recipientPdaCache.set(cacheKey, pda);
   return pda;
}

function parseTokenAmount(input: string, decimals: number) {
   if (isNaN(Number(input))) {
      return 0n;
   }

   const tokenMath = createTokenAmount(decimals);
   return tokenMath.fromDecimal(input);
}

export function useFaucetActions() {
   const { send } = useSendTransaction();
   const signer = useWalletSigner();
   const { notifySuccess } = useTransactionToast();

   type SendArgs = Parameters<typeof send>[0];
   type Instruction = SendArgs['instructions'][number];

   const refreshFaucetConfig = () =>
      queryClient.invalidateQueries({
         queryKey: queryKeys.faucetConfig.all,
      });

   const refreshRecipientData = (address?: string | null) =>
      queryClient.invalidateQueries({
         queryKey: queryKeys.faucetRecipient.byAddress(address),
      });

   const sendInstructions = async (
      builder: (walletSigner: TransactionSigner) => Promise<Instruction | Instruction[]>
   ): Promise<string> => {
      const walletSigner = requireSigner(signer);
      const instructions = await builder(walletSigner);
      const instructionList = Array.isArray(instructions) ? instructions : [instructions];

      return await send({
         instructions: instructionList,
         feePayer: walletSigner,
         authority: walletSigner,
         commitment: 'confirmed',
      });
   };

   const faucetConfig = useQuery({
      queryKey: queryKeys.faucetConfig.all,
      queryFn: async () => {
         const pda = await getFaucetConfigPda();
         const res = await fetchMaybeFaucetConfig(client.runtime.rpc, pda);

         return {
            exists: res.exists,
            data: res.exists ? res.data : null,
            address: res.address,
         };
      },
   });

   const recipientData = useQuery({
      queryKey: queryKeys.faucetRecipient.byAddress(signer?.address?.toString()),
      enabled: Boolean(signer),
      queryFn: async () => {
         const pda = await getRecipientDataPda(requireSigner(signer).address);
         const res = await fetchMaybeFaucetRecipientData(client.runtime.rpc, pda);

         return {
            exists: res.exists,
            data: res.exists ? res.data : null,
            address: res.address,
         };
      },
   });

   const mintInfo = useQuery({
      queryKey: queryKeys.faucetMint.byAddress(faucetConfig.data?.data?.mint.toString()),
      enabled: Boolean(faucetConfig.data?.exists),
      queryFn: async () => {
         const mintAddress = faucetConfig.data?.data?.mint;
         if (!mintAddress) return null;
         return await fetchMint(client.runtime.rpc, mintAddress);
      },
   });

   const getConfigOrThrow = () => {
      const config = faucetConfig.data?.data;

      if (!faucetConfig.data?.exists || !config) {
         throw new Error('Faucet is not initialized.');
      }

      return config;
   };

   const initialize = useMutation({
      mutationFn: async ({ mint }: InitializeFaucetParams) => {
         const mintAddress = address(mint);
         return await sendInstructions(signer =>
            getInitializeFaucetInstructionAsync({
               mint: mintAddress,
               owner: signer,
            })
         );
      },
      onError: error => {
         toast.error(resolveErrorMessage(error, 'Failed to initialize faucet'));
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Faucet initialized', signature });
         refreshFaucetConfig();
      },
   });

   const deposit = useMutation({
      mutationFn: async ({ amount }: FaucetAmountParams) => {
         const walletSigner = requireSigner(signer);
         const config = getConfigOrThrow();
         const mintInfo = await fetchMint(client.runtime.rpc, config.mint);
         const amountInBaseUnits = parseTokenAmount(amount, mintInfo.data.decimals);

         if (amountInBaseUnits <= 0n) {
            throw new Error('Amount must be greater than zero.');
         }

         const [depositorAta] = await findAssociatedTokenPda({
            owner: walletSigner.address,
            mint: config.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         const faucetConfigPda = await getFaucetConfigPda();
         const createDepositorAta = await getCreateAssociatedTokenIdempotentInstructionAsync({
            payer: walletSigner,
            ata: depositorAta,
            owner: walletSigner.address,
            mint: config.mint,
         });

         const depositIx = await getDepositToFaucetInstructionAsync({
            faucetConfig: faucetConfigPda,
            treasuryAta: config.treasuryAta,
            depositorAta,
            depositor: walletSigner,
            amount: amountInBaseUnits,
         });

         return await sendInstructions(async () => [createDepositorAta, depositIx]);
      },
      onError: error => {
         toast.error(resolveErrorMessage(error, 'Failed to deposit tokens'));
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Deposit confirmed', signature });
         refreshFaucetConfig();
      },
   });

   const withdraw = useMutation({
      mutationFn: async ({ amount }: FaucetAmountParams) => {
         const walletSigner = requireSigner(signer);
         const config = getConfigOrThrow();
         const mintInfo = await fetchMint(client.runtime.rpc, config.mint);
         const amountInBaseUnits = parseTokenAmount(amount, mintInfo.data.decimals);

         if (amountInBaseUnits <= 0n) {
            throw new Error('Amount must be greater than zero.');
         }

         const [ownerAta] = await findAssociatedTokenPda({
            owner: walletSigner.address,
            mint: config.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         const faucetConfigPda = await getFaucetConfigPda();

         const withdrawIx = await getWithdrawFromFaucetInstructionAsync({
            faucetConfig: faucetConfigPda,
            treasuryAta: config.treasuryAta,
            amount: amountInBaseUnits,
            owner: walletSigner,
            ownerAta,
         });

         return await sendInstructions(async () => [withdrawIx]);
      },
      onError: error => {
         toast.error(resolveErrorMessage(error, 'Failed to withdraw tokens'));
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Withdraw confirmed', signature });
         refreshFaucetConfig();
      },
   });

   const claim = useMutation({
      mutationFn: async () => {
         const walletSigner = requireSigner(signer);
         const config = getConfigOrThrow();
         const [recipientAta] = await findAssociatedTokenPda({
            owner: walletSigner.address,
            mint: config.mint,
            tokenProgram: TOKEN_PROGRAM_ADDRESS,
         });

         const faucetConfigPda = await getFaucetConfigPda();
         const createRecipientAta = await getCreateAssociatedTokenIdempotentInstructionAsync({
            payer: walletSigner,
            ata: recipientAta,
            owner: walletSigner.address,
            mint: config.mint,
         });

         const claimIx = await getClaimFromFaucetInstructionAsync({
            faucetConfig: faucetConfigPda,
            treasuryAta: config.treasuryAta,
            recipientAta,
            recipient: walletSigner,
         });

         return await sendInstructions(async () => [createRecipientAta, claimIx]);
      },
      onError: error => {
         toast.error(resolveErrorMessage(error, 'Failed to claim tokens'));
      },
      onSuccess: signature => {
         notifySuccess({ title: 'Tokens claimed', signature });
         refreshFaucetConfig();
         refreshRecipientData(signer?.address?.toString());
      },
   });

   return {
      faucetConfig,
      recipientData,
      mintInfo,
      initialize,
      deposit,
      withdraw,
      claim,
   };
}
