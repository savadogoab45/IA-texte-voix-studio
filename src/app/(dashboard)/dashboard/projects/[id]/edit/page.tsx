"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  FolderPen,
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

type ProjectFormValues = {
  name: string;
  description: string;
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.id as string;
  const utils = api.useUtils();

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
    }
  });

  // =========================================
  // Récupérer le projet
  // =========================================

  const projectQuery = api.project.get.useQuery(
    {
      projectId,
    },
    {
      enabled: Boolean(projectId),
    },
  );

  // =========================================
  // Mutation modification
  // =========================================

  const updateProject = api.project.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.project.get.invalidate({ projectId }),
        utils.project.getAll.invalidate(),
      ]);
      router.push("/dashboard/projects");
    },
  });

  // =========================================
  // Remplir le formulaire
  // =========================================

  useEffect(() => {
    if (!projectQuery.data) {
      return;
    }

    form.reset({
      name: projectQuery.data.name,
      description:
        projectQuery.data.description ?? "",
    });
  }, [projectQuery.data, form]);

  // =========================================
  // Submit
  // =========================================

  async function onSubmit(values: ProjectFormValues) {
    try {
      await updateProject.mutateAsync({
        projectId,
        name: values.name.trim(),
        description:
          values.description.trim(),
      });
      router.push(`/dashboard/projects/${projectId}/documents`);
    } catch (error) {
      console.error(
        "Erreur lors de la modification du projet :",
        error,
      );
    }
  }

  // =========================================
  // Chargement
  // =========================================

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
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
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

  // =========================================
  // Projet introuvable / erreur
  // =========================================

  if (projectQuery.isError || !projectQuery.data) {
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
        <h2 className="text-xl font-semibold">
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
          Le projet demandé n&apos;existe pas ou
          vous n&apos;avez pas accès à celui-ci.
        </p>

        <Button
          asChild
          className="mt-6 rounded-xl"
        >
          <Link href="/dashboard/projects">
            Retour aux projets
          </Link>
        </Button>
      </div>
    );
  }

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
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 size-4" />
            Retour aux projets
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          {/* Icon */}

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
              dark:shadow-lg
              dark:shadow-sky-950/20
            "
          >
            <FolderPen
              className="
                size-6
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          {/* Title */}

          <div>
            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-slate-100
                sm:text-3xl
              "
            >
              Modifier le projet
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Modifiez les informations de votre projet.
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
            {/* =====================================
                NOM
                ===================================== */}

            <FormField
              control={form.control}
              name="name"
              rules={{
                required:
                  "Le nom du projet est obligatoire.",
                minLength: {
                  value: 3,
                  message:
                    "Le nom doit contenir au moins 3 caractères.",
                },
                maxLength: {
                  value: 50,
                  message:
                    "Le nom ne peut pas dépasser 50 caractères.",
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
                    Nom du projet
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex. Mon podcast"
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
                        dark:focus-visible:border-sky-500
                        dark:focus-visible:ring-sky-500/20
                      "
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =====================================
                DESCRIPTION
                ===================================== */}

            <FormField
              control={form.control}
              name="description"
              rules={{
                maxLength: {
                  value: 500,
                  message:
                    "La description ne peut pas dépasser 500 caractères.",
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
                    Description

                    <span
                      className="
                        ml-1
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      (facultatif)
                    </span>
                  </FormLabel>

                  <FormControl>
                    <textarea
                      {...field}
                      rows={5}
                      placeholder="Décrivez votre projet..."
                      className="
                        flex
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-3
                        text-sm
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
                        dark:focus:border-sky-500
                        dark:focus:ring-sky-500/20
                      "
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* =====================================
                ERROR
                ===================================== */}

            {updateProject.isError && (
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
                {updateProject.error.message ||
                  "Impossible de modifier le projet."}
              </div>
            )}

            {/* =====================================
                ACTIONS
                ===================================== */}

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
                  hover:bg-slate-50
                  hover:text-slate-900

                  dark:border-[#244166]
                  dark:bg-[#0b1830]
                  dark:text-slate-300
                  dark:hover:bg-[#10213d]
                  dark:hover:text-slate-100
                "
              >
                <Link href={`/dashboard/projects/${projectId}/documents`}>
                  Annuler
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={updateProject.isPending}
                className="
                  rounded-xl
                  shadow-sm
                  shadow-sky-500/10
                "
              >
                {updateProject.isPending ? (
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

                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FolderPen className="mr-2 size-4" />

                    Enregistrer les modifications
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