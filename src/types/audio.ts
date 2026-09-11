type AudioJobStatus = "PENDING" | "COMPLETED" | "FAILED";

export type AudioJobSummary = {
  id: string;
  status: AudioJobStatus;
  sourceText?: string | null;
  outputFileUrl?: string | null;
  durationSec?: number | null;
};
