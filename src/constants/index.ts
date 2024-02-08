import type { Token } from "@/lib/types";

export const tokenDefaultValues: Token & { description: string } = {
  name: "",
  amount: 0,
  symbol: "",
  decimals: 0,
  description: "",
  metadataUrl: ""
}