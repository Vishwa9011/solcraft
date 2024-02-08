import * as z from "zod";

export const tokenSchema = z.object({
  name: z.string().min(1, { message: "Token name is required" }),
  symbol: z.string().min(1, { message: "Token symbol is required" }),
  description: z.string().min(1, { message: "Token description is required" }),
  amount: z.coerce.number()
    .gt(0, { message: "Token amount must be greater than 0" }),
  decimals: z.coerce.number()
    .gte(0, { message: "Token decimals must be greater than or equal to 0" })
    .lte(9, { message: "Token decimals must be less than or equal to 9" }),
  metadataUrl: z.string()
    .url({ message: "Token metadata URI must be a valid URL" }),
});

export type TokenSchema = z.infer<typeof tokenSchema>;
