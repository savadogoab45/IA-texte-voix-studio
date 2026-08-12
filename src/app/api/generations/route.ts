import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { db } from "@/server/db";

export async function POST(request: Request) {
    try {
        // 1. Vérifier la session Better Auth
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "Non authentifié",
                },
                {
                    status: 401,
                },
            );
        }

        // 2. Récupérer les données
        const body = await request.json();

        const {
            documentId,
            title,
            prompt,
        } = body;

        if (
            typeof documentId !== "string" ||
            !documentId.trim() ||
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {
            return NextResponse.json(
                {
                    error: "documentId et prompt sont obligatoires.",
                },
                {
                    status: 400,
                },
            );
        }

        // 3. Vérifier que le document appartient
        //    bien à l'utilisateur connecté
        const document = await db.document.findFirst({
            where: {
                id: documentId,
                deletedAt: null,
                project: {
                    userId: session.user.id,
                    deletedAt: null,
                },
            },
        });

        if (!document) {
            return NextResponse.json(
                {
                    error: "Document introuvable.",
                },
                {
                    status: 404,
                },
            );
        }

        // 4. Créer la génération
        const generation = await db.generation.create({
            data: {
                title:
                    title?.trim() ??
                    "Nouvelle génération",

                prompt: prompt.trim(),

                provider: "OPENAI",

                status: "PENDING",

                progress: 0,

                currentStep: "Préparation",

                documentId: document.id,
            },
        });

        try {
            // 5. Passer en RUNNING
            await db.generation.update({
                where: {
                    id: generation.id,
                },
                data: {
                    status: "RUNNING",
                    progress: 10,
                    currentStep: "Génération du texte",
                },
            });

            // 6. Appeler OpenAI
            const response =
                await openai.responses.create({
                    model:
                        process.env.OPENAI_MODEL ??
                        "gpt-4.1-mini",

                    input: prompt.trim(),
                });

            const result =
                response.output_text?.trim();

            if (!result) {
                throw new Error(
                    "OpenAI n'a retourné aucun résultat.",
                );
            }

            // 7. Sauvegarder le résultat
            const completedGeneration =
                await db.generation.update({
                    where: {
                        id: generation.id,
                    },
                    data: {
                        result,

                        status: "COMPLETED",

                        progress: 100,

                        currentStep: "Terminé",
                    },
                });

            return NextResponse.json(
                {
                    generation: completedGeneration,
                },
                {
                    status: 201,
                },
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue pendant la génération.";

            // 8. Enregistrer l'échec
            await db.generation.update({
                where: {
                    id: generation.id,
                },
                data: {
                    status: "FAILED",

                    progress: 0,

                    currentStep: "Échec",

                    error: message,
                },
            });

            return NextResponse.json(
                {
                    error: message,

                    generationId: generation.id,
                },
                {
                    status: 500,
                },
            );
        }
    } catch (error) {
        console.error(
            "POST /api/generations:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Une erreur interne est survenue.",
            },
            {
                status: 500,
            },
        );
    }
}