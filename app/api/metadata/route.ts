import z from 'zod';
import { pinata } from '@/lib/pinata';
import { NextRequest, NextResponse } from 'next/server';

const metadataSchema = z.object({
   name: z.string().min(1),
   symbol: z.string().min(1),
   decimals: z.number().min(0).max(9),
   description: z.string().optional(),
   image: z.url().optional(),
   external_url: z.url().optional(),
   twitter: z.url().optional(),
   discord: z.url().optional(),
   website: z.url().optional(),
   telegram: z.url().optional(),
   attributes: z
      .array(
         z.object({
            trait_type: z.string(),
            value: z.string(),
         })
      )
      .optional(),
});

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();

      const parsed = metadataSchema.safeParse(body);
      if (!parsed.success) {
         return NextResponse.json({ error: 'Invalid metadata format', details: parsed.error }, { status: 400 });
      }

      const { cid } = await pinata.upload.public.json(parsed.data);
      const url = await pinata.gateways.public.convert(cid);
      return NextResponse.json({
         success: true,
         url,
      });
   } catch (error) {
      console.error('Metadata upload error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
