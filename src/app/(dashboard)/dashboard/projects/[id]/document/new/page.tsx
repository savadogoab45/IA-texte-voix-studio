"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  FilePlus,
} from "lucide-react";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { api } from "@/trpc/react";

type DocumentFormValues = {
  title: string;
  content: string;
};

export default function NewDocumentPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.id as string;

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  const form = useForm<DocumentFormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const projectQuery = api.project.get.useQuery(
    {
      projectId,
    },
    {
      enabled: Boolean(projectId),
    },
  );

  const createDocument =
    api.document.create.useMutation({
      onSuccess: () => {
        router.push(
          `/dashboard/projects/${projectId}`,
        );
      },

      onError: (error) => {
        setErrorMessage(
          error.message ||
            "Impossible de créer le document.",
        );
      },
    });

  async function onSubmit(
    values: DocumentFormValues,
  ) {
    setErrorMessage(null);

    await createDocument.mutateAsync({
      title: values.title.trim(),
      content: values.content.trim(),
      projectId,
    });
  }

  if (projectQuery.isLoading) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[420px]
          w-full
          max-w-3xl
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-slate-500
            dark:text-slate-400
          "
        >
          <span
            className="
              size-5
              animate-spin
              rounded-full
              border-2
              border-slate-300
              border-t-sky-500
              dark:border-slate-700
              dark:border-t-sky-400
            "
          />

          Chargement du projet...
        </div>
      </div>
    );
  }

  if (
    projectQuery.isError ||
    !projectQuery.data
  ) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[420px]
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
          dark:border-[#1e3354]
          dark:bg-[#0b1830]
        "
      >
        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          Projet introuvable
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Impossible de créer un document dans ce projet.
        </p>

        <Button
          asChild
          className="mt-6 rounded-xl"
        >
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 size-4" />
            Retour aux projets
          </Link>
        </Button>
      </div>
    );
  }

  const project = projectQuery.data;

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-3xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================================
          HEADER
          ========================================= */}

      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="
            -ml-2
            mb-4
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
            href={`/dashboard/projects/${project.id}`}
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour au projet
          </Link>
        </Button>

        <div className="flex items-center gap-4">
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
            <FilePlus
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
              Nouveau document
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Ajoutez un document au projet «{" "}
              {project.name} ».
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM
          ========================================= */}

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
          dark:shadow-lg
          dark:shadow-blue-950/10

          sm:p-7
        "
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* TITLE */}

            <FormField
              control={form.control}
              name="title"
              rules={{
                required:
                  "Le titre du document est obligatoire.",
                minLength: {
                  value: 1,
                  message:
                    "Le titre est obligatoire.",
                },
                maxLength: {
                  value: 255,
                  message:
                    "Le titre ne peut pas dépasser 255 caractères.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Titre du document
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex. Chapitre 1"
                      className="
                        h-11
                        rounded-xl
                        border-slate-200
                        bg-white
                        text-slate-900
                        shadow-sm
                        placeholder:text-slate-400

                        focus-visible:border-sky-500
                        focus-visible:ring-sky-500/20

                        dark:border-[#1e3354]
                        dark:bg-[#071a33]
                        dark:text-slate-100
                        dark:placeholder:text-slate-500
                      "
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONTENT */}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    Contenu
                  </FormLabel>

                  <FormControl>
                    <textarea
                      {...field}
                      rows={16}
                      placeholder="Écrivez ou collez le contenu de votre document..."
                      className="
                        flex
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
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
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ERROR */}

            {errorMessage && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700

                  dark:border-red-900/50
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                {errorMessage}
              </div>
            )}

            {/* ACTIONS */}

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
                asChild
                className="
                  rounded-xl
                  border-slate-200
                  bg-white
                  text-slate-700

                  dark:border-[#244166]
                  dark:bg-[#0b1830]
                  dark:text-slate-300
                "
              >
                <Link
                  href={`/dashboard/projects/${project.id}/document`}
                >
                  Annuler
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={createDocument.isPending}
                className="rounded-xl"
              >
                {createDocument.isPending ? (
                  <>
                    <span
                      className="
                        mr-2
                        size-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Création...
                  </>
                ) : (
                  <>
                    <FilePlus className="mr-2 size-4" />
                    Créer le document
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}