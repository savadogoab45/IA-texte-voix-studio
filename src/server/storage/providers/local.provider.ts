import fs from "node:fs/promises";
import path from "node:path";

import type { StorageProvider } from "../interfaces/storage-provider";
import type { UploadFileDto } from "../dtos/upload-file.dto";
import type { UploadResultDto } from "../dtos/upload-result.dto";

export class LocalStorageProvider
  implements StorageProvider
{
  async upload(
    input: UploadFileDto,
  ): Promise<UploadResultDto> {
    // =========================================================
    // DOSSIER STORAGE
    // =========================================================

    const folder = path.join(
      process.cwd(),
      "public",
      "uploads",
    );

    await fs.mkdir(folder, {
      recursive: true,
    });

    // =========================================================
    // SECURISATION DU NOM
    // =========================================================

    const filename = path.basename(
      input.filename,
    );

    const filepath = path.join(
      folder,
      filename,
    );

    // =========================================================
    // VERIFICATION BUFFER
    // =========================================================

    if (!input.buffer) {
      throw new Error(
        "Le buffer audio est absent.",
      );
    }

    if (input.buffer.length === 0) {
      throw new Error(
        "Le fichier audio est vide.",
      );
    }

    console.log(
      "☁️ Local Storage upload:",
      {
        filename,
        filepath,
        size: input.buffer.length,
      },
    );

    // =========================================================
    // ECRITURE
    // =========================================================

    await fs.writeFile(
      filepath,
      input.buffer,
    );

    // =========================================================
    // VERIFICATION
    // =========================================================

    const stats = await fs.stat(
      filepath,
    );

    console.log(
      "📦 Fichier stocké:",
      {
        filepath,
        size: stats.size,
      },
    );

    if (stats.size === 0) {
      throw new Error(
        "Le fichier audio enregistré est vide.",
      );
    }

    // =========================================================
    // URL PUBLIQUE
    // =========================================================

    const url =
      `/uploads/${encodeURIComponent(filename)}`;

    console.log(
      "🔗 URL audio:",
      url,
    );

    return {
      url,
      path: filepath,
      size: stats.size,
    };
  }
}