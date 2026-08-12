import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Aucune image n'a été envoyée.",
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format non supporté. Utilisez JPG, PNG ou WebP.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "L'image ne doit pas dépasser 5 Mo.",
        },
        {
          status: 400,
        },
      );
    }

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = extensionMap[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          error: "Extension invalide.",
        },
        {
          status: 400,
        },
      );
    }

    const fileName = `${randomUUID()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "avatars",
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const bytes = await file.arrayBuffer();

    await writeFile(
      path.join(uploadDirectory, fileName),
      Buffer.from(bytes),
    );

    const imageUrl = `/uploads/avatars/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error(
      "Avatar upload error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Impossible d'envoyer l'image.",
      },
      {
        status: 500,
      },
    );
  }
}