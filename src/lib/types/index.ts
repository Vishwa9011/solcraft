
export type ChildrenNode = {
  children: React.ReactNode;
}

export type TODO = any;

export type Token = {
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  metadataUrl: string;
}

export type TokenMetadata = {
  description: string,
  image: string
}

export type TokenWithMetadata = Token & TokenMetadata;
