import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Nettoyer le nom de fichier
    const originalName = file.name.replace(/\s+/g, "-");
    const filename = `${Date.now()}-${originalName}`;
    
    // Chemin vers le dossier public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // S'assurer que le dossier existe
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    // L'URL publique sera accessible via /uploads/nom-du-fichier
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Erreur serveur upload local:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
