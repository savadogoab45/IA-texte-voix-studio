import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

import { VoiceRepository } from "@/server/voice/repositories/voice.repository";
import { VoiceProviderFactory } from "@/server/voice/factory/voice-provider.factory";

export async function POST(request: Request) {
    try {
        // ============================================
        // AUTH
        // ============================================

        const session =
            await auth.api.getSession({
                headers: request.headers,
            });

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Non authentifié.",
                },
                {
                    status: 401,
                },
            );
        }

        // ============================================
        // BODY
        // ============================================

        const body = await request.json();

        const voiceId = body.voiceId;
        const text = body.text;

        if (
            typeof voiceId !== "string" ||
            !voiceId.trim()
        ) {
            return NextResponse.json(
                {
                    error: "voiceId est obligatoire.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            typeof text !== "string" ||
            !text.trim()
        ) {
            return NextResponse.json(
                {
                    error: "Le texte est obligatoire.",
                },
                {
                    status: 400,
                },
            );
        }

        // ============================================
        // VOICE DATABASE
        // ============================================

        const repository =
            new VoiceRepository();

        const voice =
            await repository.findById(voiceId);

        if (!voice) {
            return NextResponse.json(
                {
                    error: "Voix introuvable.",
                },
                {
                    status: 404,
                },
            );
        }

        if (
            !voice.isActive ||
            voice.deletedAt
        ) {
            return NextResponse.json(
                {
                    error:
                        "Cette voix n'est pas disponible.",
                },
                {
                    status: 400,
                },
            );
        }

        // ============================================
        // PROVIDER
        // ============================================

        const provider =
            VoiceProviderFactory.create(
                voice.provider,

            );

        console.log("🎤 Preview voice:", {
            id: voice.id,
            name: voice.name,
            provider: voice.provider,
            providerVoiceId: voice.providerVoiceId,
        });

        // ============================================
        // GENERATE
        // ============================================

        const result =
            await provider.generate({
                text: text.trim(),
                voiceId:
                    voice.providerVoiceId,
            });

        // ============================================
        // BUFFER -> UINT8ARRAY
        // ============================================

        const audio = new Uint8Array(
            result.buffer,
        );

        // ============================================
        // RESPONSE
        // ============================================

        return new NextResponse(audio, {
            status: 200,

            headers: {
                "Content-Type":
                    result.mimeType,

                "Content-Length":
                    String(audio.byteLength),

                "Cache-Control":
                    "no-store, no-cache, must-revalidate",
            },
        });


    } catch (error) {
        console.error(
            "❌ Erreur preview voice:",
            error,
        );

        const message =
            error instanceof Error
                ? error.message
                : "Erreur lors de la génération audio.";

        const isQuotaError =
            message.includes("Quota OpenAI") ||
            message.includes("insufficient_quota") ||
            message.includes("exceeded your current quota");

        const isAuthError =
            message.includes("Clé API OpenAI invalide") ||
            message.includes("invalid_api_key");

        return NextResponse.json(
            {
                error: message,
            },
            {
                status: isQuotaError ? 429 : isAuthError ? 401 : 500,
            },
        );
    }
}