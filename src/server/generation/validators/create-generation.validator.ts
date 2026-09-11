import { VoiceProviderType } from "@prisma/client";
import { z } from "zod";

export const CreateGenerationSchema = z.object({
    title: z.string().min(1).max(255),
    prompt: z.string(),
    providerVoice: z.nativeEnum(VoiceProviderType),
    documentId: z.string(),
    voiceId: z.string(),
});

export type CreateGenerationInput =
    z.infer<typeof CreateGenerationSchema>;