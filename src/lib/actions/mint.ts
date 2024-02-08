import { PROGRAM_ID, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { Token, TokenWithMetadata } from "../types";


export const uploadMetadata = async (token: TokenWithMetadata) => {
  const { name, amount, decimals, description, image, symbol } = token;
  if (!name || !amount || !decimals || !description || !image || !symbol) return;

  const metadata = JSON.stringify({ name, symbol, description, image });

  try {
    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: metadata,
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
        "Content-Type": "application/json"
      }
    })
    const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    return url;
  } catch (error) {
    console.log('error: ', error);
  }
}

export const uploadImagePinata = async (file: File) => {
  console.log('file: ', file);
  if (!file) return;
  try {
    const formData = new FormData();
    console.log('formData: ', formData);
    formData.append('file', file);

    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
        "Content-Type": "multipart/form-data"
      }
    })
    const imaHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    console.log('imaHash: ', imaHash);
    return imaHash;
  } catch (error) {
    console.log('error: ', error);
  }
}



export const createTokenAndMint = async (token: TokenWithMetadata, wallet: WalletContextState, connection: Connection) => {
  const { publicKey, sendTransaction } = wallet;

  if (!publicKey) return;

  const mintKeypair = Keypair.generate();

  const lamport = await getMinimumBalanceForRentExemptMint(connection);
  const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);

  try {
    const metadataUrl = (await uploadMetadata(token)) ?? "default";
    if (!metadataUrl) return;
    console.log('metadataUrl: ', metadataUrl);

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: PublicKey.findProgramAddressSync([Buffer.from("metadata"), PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()], PROGRAM_ID)[0],
        mint: mintKeypair.publicKey,
        mintAuthority: publicKey,
        payer: publicKey,
        updateAuthority: publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: token.name,
            symbol: token.symbol,
            uri: metadataUrl,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
          },
          collectionDetails: null,
          isMutable: false,
        }
      }
    )

    const createNewTokenTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: lamport,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID
      }),
      createInitializeMintInstruction(mintKeypair.publicKey, token.decimals, publicKey, publicKey, TOKEN_PROGRAM_ID),
      createAssociatedTokenAccountInstruction(publicKey, tokenATA, publicKey, mintKeypair.publicKey),
      createMintToInstruction(mintKeypair.publicKey, tokenATA, publicKey, Number(token.amount) * (10 ** token.decimals)),
      createMetadataInstruction
    )

    const signature = await sendTransaction(createNewTokenTransaction, connection, { signers: [mintKeypair] });

    console.log('signature: ', mintKeypair.publicKey.toBase58(), signature);
  } catch (error) {
    console.log('error: ', error);
  }
}