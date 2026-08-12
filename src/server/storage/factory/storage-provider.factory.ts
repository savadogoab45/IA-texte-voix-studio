import { StorageProviderType } from "@prisma/client";

import type { StorageProvider } from "../interfaces/storage-provider";

import { LocalStorageProvider } from "../providers/local.provider";
/*import { S3StorageProvider } from "../providers/s3.provider";
import { R2StorageProvider } from "../providers/r2.provider";
import { SupabaseStorageProvider } from "../providers/supabase.provider";
*/
export class StorageProviderFactory {
  static create(provider: StorageProviderType): StorageProvider {
    switch (provider) {
      case StorageProviderType.LOCAL:
        return new LocalStorageProvider();

/*     case StorageProviderType.S3:
        return new S3StorageProvider();

      case StorageProviderType.R2:
        return new R2StorageProvider();

      case StorageProviderType.SUPABASE:
        return new SupabaseStorageProvider();
*/
      default:
        throw new Error(
          `Storage provider "${provider}" non supporté.`,
        );
    }
  }
}