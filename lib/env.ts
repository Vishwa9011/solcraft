import z from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
   client: {
      NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production', 'test']),
      NEXT_PUBLIC_PINATA_GATEWAY_URL: z.string().min(1),
   },
   server: {
      PINATA_JWT_TOKEN: z.string().min(1),
      CLOUDINARY_CLOUD_NAME: z.string().min(1),
      CLOUDINARY_API_KEY: z.string().min(1),
      CLOUDINARY_API_SECRET: z.string().min(1),
   },
   runtimeEnv: {
      NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      PINATA_JWT_TOKEN: process.env.PINATA_JWT_TOKEN,
      NEXT_PUBLIC_PINATA_GATEWAY_URL: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
   },
});
