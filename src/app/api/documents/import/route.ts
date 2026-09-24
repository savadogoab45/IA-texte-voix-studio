import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ProjectRepository } from "@/server/project/repositories/project.repository";
import { DocumentRepository } from "@/server/document/repositories/document.repository";
import { ImportDocumentService } from "@/server/document/services/import-document.service";
import { TRPCError } from "@trpc/server";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
]);

const PDF_SIGNATURE = "%PDF-";


function errorStatus(error: unknown) {
  if (error instanceof TRPCError) {
    switch (error.code) {
      case "NOT_FOUND":
        return 404;
      case "CONFLICT":
        return 409;
      case "BAD_REQUEST":
        return 400;
      default:
        return 400;
    }
  }

  return 500;
}

export async function POST(request: Request) {
    try {
        // =========================================================
        // 1. Vérifier la session
        // =========================================================

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vous devez être connecté.",
                },
                {
                    status: 401,
                },
            );
        }

        // =========================================================
        // 2. Récupérer le formulaire
        // =========================================================

        const formData = await request.formData();

        const file = formData.get("file");
        const projectId = formData.get("projectId");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Aucun fichier n'a été fourni.",
                },
                {
                    status: 400,
                },
            );
        }

        if (typeof projectId !== "string" || !projectId.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Le projet est obligatoire.",
                },
                {
                    status: 400,
                },
            );
        }

        // =========================================================
        // 3. Vérifier la taille
        // =========================================================

        if (file.size === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Le fichier est vide.",
                },
                {
                    status: 400,
                },
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Le fichier ne doit pas dépasser 20 Mo.",
                },
                {
                    status: 413,
                },
            );
        }

        // =========================================================
        // 4. Vérifier le type MIME
        // =========================================================

        const isPdfByName = file.name.toLowerCase().endsWith(".pdf");
        const isPdfByMime = file.type === "application/pdf";

        if (!ALLOWED_MIME_TYPES.has(file.type) && !isPdfByName) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Format non pris en charge. Formats acceptés : PDF, DOCX et TXT.",
                },
                {
                    status: 415,
                },
            );
        }

        // =========================================================
        // 5. Convertir le fichier en Buffer
        // =========================================================

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if ((isPdfByMime || isPdfByName) && !buffer.subarray(0, 5).toString("ascii").startsWith(PDF_SIGNATURE)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Le fichier sélectionné n'est pas un PDF valide.",
                },
                {
                    status: 400,
                },
            );
        }

        // =========================================================
        // 6. Importer le document
        // =========================================================

        const documentRepository = new DocumentRepository();
        const projectRepository = new ProjectRepository();

        const service = new ImportDocumentService(
            documentRepository,
            projectRepository,
        );

        const document = await service.execute(session.user.id, {
            projectId: projectId.trim(),
            filename: file.name,
            mimeType: file.type,
            buffer,
        });

        // =========================================================
        // 7. Réponse
        // =========================================================

        return NextResponse.json(
            {
                success: true,
                document,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("Erreur import document:", error);

        if (
            error instanceof Error &&
            error.message
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                {
                    status: 400,
                },
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Une erreur est survenue lors de l'import.",
            },
            {
                status: 500,
            },
        );
    }
}