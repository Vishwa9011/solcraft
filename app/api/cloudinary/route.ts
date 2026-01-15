import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
   try {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!(file instanceof File)) {
         return NextResponse.json({ error: 'File missing' }, { status: 400 });
      }

      // Convert File → Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<any>((resolve, reject) => {
         cloudinary.uploader
            .upload_stream(
               {
                  folder: 'token-images',
                  resource_type: 'image',
                  format: 'avif', // ✅ convert to AVIF
                  quality: 'auto', // ✅ smart compression
                  fetch_format: 'auto', // fallback support
               },
               (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
               }
            )
            .end(buffer);
      });

      return NextResponse.json({
         success: true,
         url: result.secure_url,
         publicId: result.public_id,
         format: result.format,
         bytes: result.bytes,
      });
   } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 500 });
   }
}
