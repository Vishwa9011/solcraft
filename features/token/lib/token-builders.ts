import {
  CreateTokenInput,
  getCreateTokenInstructionAsync,
  getMintTokensInstructionAsync,
  getTransferFreezeAuthorityInstruction,
  getTransferMintAuthorityInstruction,
} from "@/generated/solcraft";
import {
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
} from "@solana-program/token";
import {
  generateKeyPairSigner,
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  type Address,
  type TransactionSigner,
} from "@solana/kit";

const TOKEN_METADATA_PROGRAM_ADDRESS =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" as Address<"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s">;

export type MintTokensParams = {
  mint: Address<string>;
  amount: number;
};

export type TransferAuthorityParams = {
  mint: Address<string>;
  newAuthority: Address<string> | null;
};

export type CreateTokenParams = Pick<
  CreateTokenInput,
  "name" | "symbol" | "supply" | "decimals" | "uri"
>;

export async function getTokenMetadataAddress(mint: Address<string>) {
  const [metadata] = await getProgramDerivedAddress({
    programAddress: TOKEN_METADATA_PROGRAM_ADDRESS,
    seeds: [
      getBytesEncoder().encode(new TextEncoder().encode("metadata")),
      getAddressEncoder().encode(TOKEN_METADATA_PROGRAM_ADDRESS),
      getAddressEncoder().encode(mint),
    ],
  });

  return metadata;
}

export async function buildCreateTokenInstruction(
  signer: TransactionSigner,
  params: CreateTokenParams
) {
  const mint = await generateKeyPairSigner();

  const [payerAta] = await findAssociatedTokenPda({
    owner: signer.address,
    mint: mint.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const metadata = await getTokenMetadataAddress(mint.address);

  return await getCreateTokenInstructionAsync({
    mint,
    payer: signer,
    payerAta,
    metadata,
    ...params,
  });
}

export async function buildMintTokensInstruction(
  signer: TransactionSigner,
  { mint, amount }: MintTokensParams
) {
  return await getMintTokensInstructionAsync({
    amount,
    mint,
    recipient: signer,
  });
}

export function buildTransferFreezeAuthorityInstruction(
  signer: TransactionSigner,
  { mint, newAuthority }: TransferAuthorityParams
) {
  return getTransferFreezeAuthorityInstruction({
    mint,
    currentAuthority: signer,
    newAuthority,
  });
}

export function buildTransferMintAuthorityInstruction(
  signer: TransactionSigner,
  { mint, newAuthority }: TransferAuthorityParams
) {
  return getTransferMintAuthorityInstruction({
    mint,
    currentAuthority: signer,
    newAuthority,
  });
}
