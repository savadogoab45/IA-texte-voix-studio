"use client";

import { useMemo, useState } from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import Link from "next/link";

import {
    ArrowLeft,
    FileAudio,
    FileText,
    Mic2,
    Sparkles,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import {
    VoiceProviderType,
} from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

const VOICE_PROVIDER_LABELS: Record<
    VoiceProviderType,
    string
> = {
    MICROSOFT: "Microsoft",
    GOOGLE: "Google",
    PIPER: "Piper",
    OPENAI: "OpenAI",
    ELEVENLABS: "ElevenLabs",
    MINIMAX: "MiniMax",
    EDGE_TTS: "Edge TTS",
};

const VOICE_PROVIDERS: VoiceProviderType[] = [
    "PIPER",
    "EDGE_TTS",
    "GOOGLE",
    "MICROSOFT",
    "ELEVENLABS",
    "MINIMAX",
    "OPENAI",
];

export default function NewAudioGenerationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const projectId =
        searchParams.get("projectId") ?? "";

    const documentId =
        searchParams.get("documentId") ?? "";

    // =========================================================
    // STATE
    // =========================================================

    const [title, setTitle] =
        useState("");

    const [prompt, setPrompt] =
        useState("");

    /**
     * Fournisseur vocal uniquement.
     *
     * providerAi n'existe PAS dans cette page.
     */
    const [providerVoice, setProviderVoice] =
        useState<VoiceProviderType>("PIPER");

    /**
     * Voix sélectionnée.
     */
    const [voiceId, setVoiceId] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // =========================================================
    // DOCUMENT
    // =========================================================

    const documentQuery =
        api.document.getById.useQuery(
            {
                documentId,
            },
            {
                enabled:
                    Boolean(documentId),
            },
        );

    // =========================================================
    // VOICES
    // =========================================================

    const voicesQuery =
        api.voice.getAll.useQuery(
            undefined,
            {
                enabled: true,
            },
        );

    // =========================================================
    // GENERATION
    // =========================================================

    const createGeneration =
        api.generation.create.useMutation({
            onSuccess: (generation) => {
                router.push(
                    `/dashboard/projects/${projectId}`,
                );
            },

            onError: (error) => {
                console.error(
                    "❌ Erreur création génération :",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "Impossible de créer la génération.",
                );
            },
        });

    // =========================================================
    // DATA
    // =========================================================

    const document =
        documentQuery.data;

    const voices =
        voicesQuery.data ?? [];

    // =========================================================
    // FILTER VOICES
    // =========================================================

    /**
     * IMPORTANT :
     *
     * Seules les voix du fournisseur sélectionné
     * sont affichées.
     */
    const filteredVoices = useMemo(() => {
        return voices.filter(
            (voice) =>
                voice.provider ===
                    providerVoice &&
                voice.isActive,
        );
    }, [
        voices,
        providerVoice,
    ]);

    // =========================================================
    // SELECTED VOICE
    // =========================================================

    const selectedVoice =
        useMemo(() => {
            return filteredVoices.find(
                (voice) =>
                    voice.id === voiceId,
            );
        }, [
            filteredVoices,
            voiceId,
        ]);

    // =========================================================
    // USE DOCUMENT
    // =========================================================

    function handleUseDocumentContent() {
        if (!document) {
            return;
        }

        setPrompt(
            document.content ?? "",
        );

        if (!title.trim()) {
            setTitle(
                document.title,
            );
        }
    }

    // =========================================================
    // PROVIDER CHANGE
    // =========================================================

    function handleProviderChange(
        provider: VoiceProviderType,
    ) {
        setProviderVoice(
            provider,
        );

        /**
         * Très important :
         * une voix Piper ne peut pas rester
         * sélectionnée lorsque l'utilisateur
         * passe sur Google, par exemple.
         */
        setVoiceId("");

        setErrorMessage("");
    }

    // =========================================================
    // SUBMIT
    // =========================================================

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setErrorMessage("");

        // -------------------------------------------------------
        // DOCUMENT
        // -------------------------------------------------------

        if (!documentId) {
            setErrorMessage(
                "Aucun document n'a été sélectionné.",
            );

            return;
        }

        // -------------------------------------------------------
        // TITLE
        // -------------------------------------------------------

        if (!title.trim()) {
            setErrorMessage(
                "Le titre de la génération est obligatoire.",
            );

            return;
        }

        // -------------------------------------------------------
        // PROMPT
        // -------------------------------------------------------

        if (!prompt.trim()) {
            setErrorMessage(
                "Le texte à convertir en audio est obligatoire.",
            );

            return;
        }

        // -------------------------------------------------------
        // VOICE
        // -------------------------------------------------------

        if (!voiceId) {
            setErrorMessage(
                "Veuillez sélectionner une voix.",
            );

            return;
        }

        // -------------------------------------------------------
        // SELECTED VOICE
        // -------------------------------------------------------

        if (!selectedVoice) {
            setErrorMessage(
                "La voix sélectionnée est introuvable ou indisponible.",
            );

            return;
        }

        // -------------------------------------------------------
        // PROVIDER VALIDATION
        // -------------------------------------------------------

        if (
            selectedVoice.provider !==
            providerVoice
        ) {
            setErrorMessage(
                "La voix sélectionnée ne correspond pas au fournisseur vocal.",
            );

            return;
        }

        // -------------------------------------------------------
        // CREATE
        // -------------------------------------------------------

        try {
            await createGeneration.mutateAsync(
                {
                    title:
                        title.trim(),

                    prompt:
                        prompt.trim(),

                    documentId,

                    /**
                     * AUDIO :
                     *
                     * providerVoice uniquement.
                     *
                     * providerAi = null côté backend.
                     */
                    providerVoice,

                    voiceId,
                },
            );
        } catch {
            // onError s'occupe de l'affichage.
        }
    }

    // =========================================================
    // DOCUMENT LOADING
    // =========================================================

    if (
        documentQuery.isLoading
    ) {
        return (
            <div
                className="
                    mx-auto
                    flex
                    min-h-[500px]
                    w-full
                    max-w-4xl
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    <Loader2
                        className="
                            size-5
                            animate-spin
                            text-sky-500
                        "
                    />

                    Chargement du document...
                </div>
            </div>
        );
    }

    // =========================================================
    // DOCUMENT NOT FOUND
    // =========================================================

    if (
        !documentId ||
        documentQuery.isError ||
        !document
    ) {
        return (
            <div
                className="
                    mx-auto
                    flex
                    min-h-[500px]
                    w-full
                    max-w-3xl
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    text-center
                    shadow-sm

                    dark:border-[#1e3354]
                    dark:bg-[#0b1830]
                "
            >
                <div
                    className="
                        flex
                        size-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-50

                        dark:bg-red-950/30
                    "
                >
                    <AlertCircle
                        className="
                            size-7
                            text-red-500
                            dark:text-red-400
                        "
                    />
                </div>

                <h2
                    className="
                        mt-5
                        text-xl
                        font-semibold
                        text-slate-900
                        dark:text-slate-100
                    "
                >
                    Document introuvable
                </h2>

                <p
                    className="
                        mt-2
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Sélectionnez un document valide
                    avant de créer une génération
                    audio.
                </p>

                <Button
                    asChild
                    className="
                        mt-6
                        rounded-xl
                    "
                >
                    <Link
                        href={`/dashboard/projects/${projectId}`}
                    >
                        <ArrowLeft
                            className="
                                mr-2
                                size-4
                            "
                        />

                        Retour au projet
                    </Link>
                </Button>
            </div>
        );
    }

    // =========================================================
    // MAIN
    // =========================================================

    return (
        <div
            className="
                mx-auto
                w-full
                max-w-4xl
                text-slate-900
                dark:text-slate-100
            "
        >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="mb-8">
                <Button
                    asChild
                    variant="ghost"
                    className="
                        -ml-2
                        mb-5
                        rounded-lg
                        text-slate-600
                        hover:bg-slate-100
                        hover:text-slate-900

                        dark:text-slate-400
                        dark:hover:bg-[#10213d]
                        dark:hover:text-slate-100
                    "
                >
                    <Link
                        href={`/dashboard/projects/${projectId}`}
                    >
                        <ArrowLeft
                            className="
                                mr-2
                                size-4
                            "
                        />

                        Retour au projet
                    </Link>
                </Button>

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >
                    <div
                        className="
                            flex
                            size-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-sky-50

                            dark:bg-sky-950/50
                        "
                    >
                        <FileAudio
                            className="
                                size-6
                                text-sky-600
                                dark:text-sky-400
                            "
                        />
                    </div>

                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                dark:text-slate-100

                                sm:text-3xl
                            "
                        >
                            Nouvelle génération audio
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Transformez le contenu de votre
                            document en audio.
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================================
                DOCUMENT
            ===================================================== */}

            <div
                className="
                    mb-6
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm

                    dark:border-[#1e3354]
                    dark:bg-[#0b1830]

                    sm:p-6
                "
            >
                <div
                    className="
                        flex
                        items-start
                        gap-4
                    "
                >
                    <div
                        className="
                            flex
                            size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-sky-50

                            dark:bg-sky-950/50
                        "
                    >
                        <FileText
                            className="
                                size-5
                                text-sky-600
                                dark:text-sky-400
                            "
                        />
                    </div>

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            Document
                        </p>

                        <h2
                            className="
                                mt-1
                                truncate
                                text-base
                                font-semibold
                                text-slate-900
                                dark:text-slate-100
                            "
                        >
                            {document.title}
                        </h2>

                        <p
                            className="
                                mt-1
                                line-clamp-2
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {document.content ??
                                "Aucun contenu disponible."}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleUseDocumentContent
                        }
                        className="
                            hidden
                            shrink-0
                            rounded-lg

                            sm:flex
                        "
                    >
                        Utiliser le document
                    </Button>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={
                        handleUseDocumentContent
                    }
                    className="
                        mt-4
                        w-full
                        rounded-lg

                        sm:hidden
                    "
                >
                    Utiliser le document
                </Button>
            </div>

            {/* =====================================================
                FORM
            ===================================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
            >
                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm

                        dark:border-[#1e3354]
                        dark:bg-[#0b1830]

                        sm:p-7
                    "
                >
                    <div className="space-y-6">

                        {/* =================================================
                            TITLE
                        ================================================= */}

                        <div>
                            <label
                                htmlFor="title"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Titre
                            </label>

                            <Input
                                id="title"
                                value={title}
                                onChange={(
                                    event,
                                ) =>
                                    setTitle(
                                        event.target.value,
                                    )
                                }
                                placeholder="Ex. Introduction à mon podcast"
                                disabled={
                                    createGeneration.isPending
                                }
                                className="
                                    h-11
                                    rounded-xl
                                    border-slate-200
                                    bg-white
                                    text-slate-900

                                    focus-visible:border-sky-500
                                    focus-visible:ring-sky-500/20

                                    dark:border-[#1e3354]
                                    dark:bg-[#071a33]
                                    dark:text-slate-100
                                    dark:placeholder:text-slate-500
                                "
                            />
                        </div>

                        {/* =================================================
                            VOICE PROVIDER
                        ================================================= */}

                        <div>
                            <label
                                htmlFor="providerVoice"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                Fournisseur vocal
                            </label>

                            <select
                                id="providerVoice"
                                value={
                                    providerVoice
                                }
                                onChange={(
                                    event,
                                ) =>
                                    handleProviderChange(
                                        event.target
                                            .value as VoiceProviderType,
                                    )
                                }
                                disabled={
                                    createGeneration.isPending
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-900
                                    outline-none

                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-500/20

                                    dark:border-[#1e3354]
                                    dark:bg-[#071a33]
                                    dark:text-slate-100
                                "
                            >
                                {VOICE_PROVIDERS.map(
                                    (
                                        provider,
                                    ) => (
                                        <option
                                            key={
                                                provider
                                            }
                                            value={
                                                provider
                                            }
                                        >
                                            {
                                                VOICE_PROVIDER_LABELS[
                                                    provider
                                                ]
                                            }
                                        </option>
                                    ),
                                )}
                            </select>

                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                Les voix affichées
                                correspondent uniquement
                                à ce fournisseur.
                            </p>
                        </div>

                        {/* =================================================
                            VOICE
                        ================================================= */}

                        <div>
                            <label
                                htmlFor="voice"
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                <Mic2
                                    className="size-4"
                                />

                                Voix
                            </label>

                            {voicesQuery.isLoading ? (
                                <div
                                    className="
                                        flex
                                        h-11
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-3
                                        text-sm
                                        text-slate-500

                                        dark:border-[#1e3354]
                                        dark:text-slate-400
                                    "
                                >
                                    <Loader2
                                        className="
                                            size-4
                                            animate-spin
                                        "
                                    />

                                    Chargement des voix...
                                </div>
                            ) : filteredVoices.length ===
                              0 ? (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-amber-200
                                        bg-amber-50
                                        p-4
                                        text-sm
                                        text-amber-700

                                        dark:border-amber-900/50
                                        dark:bg-amber-950/20
                                        dark:text-amber-400
                                    "
                                >
                                    Aucune voix active
                                    n&apos;est disponible pour{" "}
                                    <strong>
                                        {
                                            VOICE_PROVIDER_LABELS[
                                                providerVoice
                                            ]
                                        }
                                    </strong>
                                    .
                                </div>
                            ) : (
                                <select
                                    id="voice"
                                    value={
                                        voiceId
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setVoiceId(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    disabled={
                                        createGeneration.isPending
                                    }
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-3
                                        text-sm
                                        text-slate-900
                                        outline-none

                                        focus:border-sky-500
                                        focus:ring-2
                                        focus:ring-sky-500/20

                                        dark:border-[#1e3354]
                                        dark:bg-[#071a33]
                                        dark:text-slate-100
                                    "
                                >
                                    <option value="">
                                        Sélectionner une voix
                                    </option>

                                    {filteredVoices.map(
                                        (
                                            voice,
                                        ) => (
                                            <option
                                                key={
                                                    voice.id
                                                }
                                                value={
                                                    voice.id
                                                }
                                            >
                                                {
                                                    voice.name
                                                }

                                                {" — "}

                                                {
                                                    voice.language
                                                }

                                                {voice.gender
                                                    ? ` — ${voice.gender}`
                                                    : ""}

                                                {" — "}

                                                {voice.type ===
                                                "FREE"
                                                    ? "Gratuit"
                                                    : "Premium"}
                                            </option>
                                        ),
                                    )}
                                </select>
                            )}

                            {selectedVoice && (
                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    <CheckCircle2
                                        className="
                                            size-3.5
                                            text-emerald-500
                                        "
                                    />

                                    Voix sélectionnée :
                                    <strong>
                                        {
                                            selectedVoice.name
                                        }
                                    </strong>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            PROMPT
                        ================================================= */}

                        <div>
                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <label
                                    htmlFor="prompt"
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-200
                                    "
                                >
                                    Texte à convertir en audio
                                </label>

                                <span
                                    className="
                                        text-xs
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    {prompt.length.toLocaleString(
                                        "fr-FR",
                                    )}{" "}
                                    caractères
                                </span>
                            </div>

                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(
                                    event,
                                ) =>
                                    setPrompt(
                                        event.target
                                            .value,
                                    )
                                }
                                disabled={
                                    createGeneration.isPending
                                }
                                placeholder="Saisissez le texte qui sera transformé en audio..."
                                className="
                                    flex
                                    h-64
                                    min-h-64
                                    max-h-64
                                    w-full
                                    resize-none
                                    overflow-y-auto
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-3
                                    text-sm
                                    leading-6
                                    text-slate-900
                                    outline-none
                                    shadow-sm
                                    placeholder:text-slate-400

                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-500/20

                                    dark:border-[#1e3354]
                                    dark:bg-[#071a33]
                                    dark:text-slate-100
                                    dark:placeholder:text-slate-500
                                "
                            />
                        </div>

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {errorMessage && (
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-4

                                    dark:border-red-900/50
                                    dark:bg-red-950/20
                                "
                            >
                                <AlertCircle
                                    className="
                                        mt-0.5
                                        size-5
                                        shrink-0
                                        text-red-500
                                        dark:text-red-400
                                    "
                                />

                                <p
                                    className="
                                        text-sm
                                        leading-5
                                        text-red-700
                                        dark:text-red-400
                                    "
                                >
                                    {errorMessage}
                                </p>
                            </div>
                        )}

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-slate-100
                                pt-6

                                dark:border-[#1e3354]

                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <Button
                                type="button"
                                variant="outline"
                                disabled={
                                    createGeneration.isPending
                                }
                                asChild
                                className="
                                    rounded-xl
                                    border-slate-200
                                    bg-white
                                    text-slate-700

                                    hover:bg-slate-50

                                    dark:border-[#244166]
                                    dark:bg-[#0b1830]
                                    dark:text-slate-300
                                    dark:hover:bg-[#10213d]
                                "
                            >
                                <Link
                                    href={`/dashboard/projects/${projectId}`}
                                >
                                    Annuler
                                </Link>
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    createGeneration.isPending ||
                                    !voiceId ||
                                    !title.trim() ||
                                    !prompt.trim()
                                }
                                className="
                                    rounded-xl
                                    shadow-sm
                                    shadow-sky-500/10
                                "
                            >
                                {createGeneration.isPending ? (
                                    <>
                                        <Loader2
                                            className="
                                                mr-2
                                                size-4
                                                animate-spin
                                            "
                                        />

                                        Création de l&apos;audio...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles
                                            className="
                                                mr-2
                                                size-4
                                            "
                                        />

                                        Générer l&apos;audio
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}