import * as z from "zod";

export const tokenSchema = z.object({
  name: z.string({ required_error: "Token name is required" }).min(1),
  symbol: z.string({ required_error: "Token symbol is required" }).min(1),
  totalSupply: z.string({ required_error: "Token total supply is required" }).min(1),
  decimals: z.number({ required_error: "Token decimals is required" })
    .lte(9, { message: "Token decimals must be less than or equal to 9" }),
  metadataUrl: z.string({ required_error: "Token metadata URL is required" })
    .url({ message: "Token metadata URI must be a valid URL" }),
})