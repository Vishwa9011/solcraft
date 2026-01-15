import { z } from 'zod';

const numericString = z.string().trim().regex(/^\d+$/, 'Enter a whole number.');
const optionalUrl = z.union([z.literal(''), z.string().trim().url('Enter a valid URL.')]);
const optionalText = z.union([
   z.literal(''),
   z.string().trim().max(280, 'Description must be 280 characters or less.'),
]);
const optionalFile = z.custom<File | null>().nullable().optional();

export const tokenFormSchema = z.object({
   name: z
      .string()
      .trim()
      .min(2, 'Token name must be at least 2 characters.')
      .max(30, 'Token name must be 30 characters or less.'),
   symbol: z
      .string()
      .trim()
      .min(2, 'Token symbol must be at least 2 characters.')
      .max(10, 'Token symbol must be 10 characters or less.')
      .regex(/^[A-Z0-9]+$/, 'Use uppercase letters and numbers only.'),
   decimals: numericString.refine(value => {
      const parsed = Number(value);
      return parsed >= 0 && parsed <= 9;
   }, 'Decimals must be between 0 and 9.'),
   supply: numericString.refine(value => Number(value) > 0, 'Supply must be greater than 0.'),
   logoUrl: optionalUrl,
   logoFile: optionalFile,
   description: optionalText,
   website: optionalUrl,
   twitter: optionalUrl,
   telegram: optionalUrl,
   discord: optionalUrl,
});

export type TokenFormValues = z.infer<typeof tokenFormSchema>;

export const tokenFormDefaults: TokenFormValues = {
   name: '',
   symbol: '',
   decimals: '9',
   supply: '',
   logoUrl: '',
   logoFile: null,
   description: '',
   website: '',
   twitter: '',
   telegram: '',
   discord: '',
};
