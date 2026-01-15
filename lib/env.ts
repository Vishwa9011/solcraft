import z from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
   client: {
      NEXT_PUBLIC_PINATA_GATEWAY_URL: z.string().min(1),
   },
   server: {
      PINATA_API_KEY: z.string().min(1),
      PINATA_API_SECRET: z.string().min(1),
      PINATA_JWT_TOKEN: z.string().min(1),
   },
   runtimeEnv: {
      NEXT_PUBLIC_PINATA_GATEWAY_URL: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
      PINATA_API_KEY: process.env.PINATA_API_KEY,
      PINATA_API_SECRET: process.env.PINATA_API_SECRET,
      PINATA_JWT_TOKEN: process.env.PINATA_JWT_TOKEN,
   },
});
