import fs from "node:fs/promises";
import path from "node:path";

import type { StorageProvider } from "../interfaces/storage-provider";
import type { UploadFileDto } from "../dtos/upload-file.dto";
import type { UploadResultDto } from "../dtos/upload-result.dto";

export class LocalStorageProvider implements StorageProvider {
  async upload(input: UploadFileDto): Promise<UploadResultDto> {
    const folder = path.join(process.cwd(), "uploads");

    await fs.mkdir(folder, {
      recursive: true,
    });

    const filepath = path.join(folder, input.filename);

    await fs.writeFile(filepath, input.buffer);

    return {
      url: `/uploads/${input.filename}`,
      path: filepath,
      size: input.buffer.length,
    };
  }
}
