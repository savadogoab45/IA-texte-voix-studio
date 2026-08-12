import type { UploadFileDto } from "../dtos/upload-file.dto";
import type { UploadResultDto } from "../dtos/upload-result.dto";

export interface StorageProvider {
  upload(input: UploadFileDto): Promise<UploadResultDto>;

  delete?(path: string): Promise<void>;

  exists?(path: string): Promise<boolean>;

  getUrl?(path: string): Promise<string>;
}