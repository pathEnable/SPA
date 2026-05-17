import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Aucun fichier uploadé" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    return new Promise<Response>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'meli-empire',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error("Erreur Cloudinary:", error);
            resolve(NextResponse.json({ success: false, error: "Échec de l'upload Cloudinary" }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ 
              success: true, 
              url: result?.secure_url,
              public_id: result?.public_id
            }));
          }
        }
      );

      uploadStream.end(buffer);
    });

  } catch (error) {
    console.error("Erreur d'upload:", error);
    return NextResponse.json({ success: false, error: "Échec de l'upload" }, { status: 500 });
  }
}
