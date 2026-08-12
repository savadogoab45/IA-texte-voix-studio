export interface UploadFileDto {
  filename: string;

  mimeType: string;

  buffer: Buffer;
}
