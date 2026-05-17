import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url'); // On passe l'URL complète maintenant

    if (!imageUrl) {
      return NextResponse.json({ error: "URL de l'image manquante" }, { status: 400 });
    }

    // Si c'est une image Cloudinary
    if (imageUrl.includes('cloudinary.com')) {
      // Extraire le public_id de l'URL
      // Exemple: https://res.cloudinary.com/cloud_name/image/upload/v12345/meli-empire/filename.jpg
      const parts = imageUrl.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const filename = filenameWithExtension.split('.')[0];
      const folder = parts[parts.length - 2];
      
      const publicId = `${folder}/${filename}`;

      try {
        await cloudinary.uploader.destroy(publicId);
        return NextResponse.json({ success: true });
      } catch (e) {
        console.error("Erreur suppression Cloudinary:", e);
        return NextResponse.json({ error: "Erreur lors de la suppression sur Cloudinary" }, { status: 500 });
      }
    }

    // Pour les images locales (anciennes)
    // On garde la logique pour ne pas casser le site pendant la transition
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      // Logique de suppression locale simplifiée ou ignorée si on passe full Cloudinary
      return NextResponse.json({ success: true, message: "Suppression locale non gérée (transition Cloudinary)" });
    }

    return NextResponse.json({ error: "Type d'image non géré" }, { status: 400 });

  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 });
  }
}
