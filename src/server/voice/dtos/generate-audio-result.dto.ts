export interface GenerateAudioResultDto {
  mimeType: string;
  extension: string;
  buffer: Buffer;
  duration?: number;
}
 