export interface GenerateAudioDto {
  text: string;

  voiceId: string;

  speed?: number;

  format?: "mp3" | "wav" | "opus";

  instructions?: string;
}
