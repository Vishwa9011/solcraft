"use client";

import { MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { EventHandler, ReactNode, createContext, useCallback, useContext, useState } from "react";
import { createAndMint, createMetadataAccountV3, getCreateMetadataAccountV3InstructionDataSerializer, MPL_TOKEN_METADATA_PROGRAM_ID, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Pda, createNoopSigner, createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi";
import base58 from "bs58";
type AppContextType = {
  handleImageChange: (event: any) => Promise<void>;
  createToken: () => Promise<void>;
}
const AppContext = createContext<AppContextType | null>(null);

type Token = {
  name: string;
  symbol: string;
  description: string;
  image: string;
  amount: number;
  decimals: number;
}

const AppProvider = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const PROGRAM_ID = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)

  const [token, setToken] = useState({ name: "Kalu", symbol: "KAL", description: "KALUA", image: "", amount: 1e6, decimals: 9 });

  const handleFormFieldChange = (fieldName: any, e: any) => {
    setToken({ ...token, [fieldName]: e.target.value });
  }

  const createToken = useCallback(async () => {
    console.log('publicKey: ', publicKey);
    if (!publicKey) return;

    const lamport = await getMinimumBalanceForRentExemptMint(connection);

    const mintKeypair = Keypair.generate();
    // const mintKeypair = Keypair.fromSecretKey(base58.decode("5vySQwkppd8LCtWfaqTCbZFhYMbxRbJbFoXi4wwy9vSPVdTensPuhpC1PgZGuAG8pzcujStZmoQ7t5jtYaqteEkN"))

    const umi = createUmi(connection);
    const userWallet = umi.eddsa.createKeypairFromSecretKey(mintKeypair.secretKey);

    const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);



    const userWalletSigner = createSignerFromKeypair(umi, userWallet);
    // const mint = generateSigner(umi);
    umi.use(signerIdentity(userWalletSigner, false))
    // umi.use(createNoopSigner(publicKey))
    umi.use(mplTokenMetadata());

    console.log('umi.payer: ', umi.payer);

    // console.log('mint: ', mint);

    try {
      const metadataUrl = "dummy" || await uploadMetadata(token);
      console.log('metadataUrl: ', metadataUrl);
      if (!metadataUrl) return;

      const createMetaDataInstruction = createMetadataAccountV3(umi, {
        metadata: PublicKey.findProgramAddressSync([Buffer.from("metadata"), PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()], PROGRAM_ID)[0] as any,
        mint: mintKeypair.publicKey as any,
        mintAuthority: publicKey as any,
        payer: publicKey as any,
        updateAuthority: publicKey as any,
        collectionDetails: null,
        data: {
          collection: null,
          name: token.name,
          symbol: token.symbol,
          uri: metadataUrl,
          sellerFeeBasisPoints: 0,
          creators: null,
          uses: null,
        },
        isMutable: true,
      })

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey as any,
          newAccountPubkey: mintKeypair.publicKey,
          lamports: lamport,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          token.decimals,
          publicKey as any,
          publicKey as any,
          TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          publicKey as any,
          tokenATA,
          publicKey as any,
          mintKeypair.publicKey
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          tokenATA,
          publicKey as any,
          Number(token.amount) * (10 ** token.decimals)
        ),
        createMetaDataInstruction as any
      )

      const signature = await sendTransaction(createNewTokenTransaction, connection, { signers: [mintKeypair] });

      console.log('signature: ', mintKeypair.publicKey.toBase58(), signature);

      // createAndMint(umi, {
      //   mint,
      //   authority: umi.identity,
      //   name: token.name,
      //   symbol: token.symbol,
      //   uri: metadataUrl,
      //   sellerFeeBasisPoints: percentAmount(0),
      //   decimals: token.decimals,
      //   amount: token.amount,
      //   tokenOwner: publicKey as any,
      //   payer: publicKey as any,
      //   tokenStandard: TokenStandard.Fungible,
      // }).sendAndConfirm(umi).then(() => {
      //   console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
      // });

    } catch (error) {
      console.log('error: ', error);
    }
  }, [publicKey, token, connection]);


  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const imgUrl = (await uploadImagePinata(file)) as string;
      setToken({ ...token, image: imgUrl });
    }
  }

  const uploadMetadata = async (token: Token) => {
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
      console.log('url: ', url);
      return url;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const uploadImagePinata = async (file: File) => {
    console.log('file: ', file);
    console.log('NEXT_PUBLIC_PINATA_API_KEY: ', process.env.NEXT_PUBLIC_PINATA_API_KEY);
    console.log('NEXT_PUBLIC_PINATA_API_KEY: ', process.env.NEXT_PUBLIC_PINATA_SECRET_KEY);
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


  return (
    <AppContext.Provider value={{ handleImageChange, createToken }}>
      {children}
    </AppContext.Provider>
  );
}


export default AppProvider;


export const useProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useProvider must be used within a AppProvider');
  }
  return context;
}