"use client";

import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { ReactNode, createContext, useCallback, useContext, useState } from "react";
import { PROGRAM_ID, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata"
import { MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";


type AppContextType = {
  handleImageChange: (file: File) => Promise<void>;
  createToken: (token: Token) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [token, setToken] = useState({ name: "Kalu", symbol: "KAL", description: "KALUA", image: "", amount: 1e6, decimals: 9 });

  const handleFormFieldChange = (fieldName: any, e: any) => {
    setToken({ ...token, [fieldName]: e.target.value });
  }

  const createToken = useCallback(async () => {
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
  }, [token, publicKey, sendTransaction, connection]);


  const handleImageChange = async (file: File) => {
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