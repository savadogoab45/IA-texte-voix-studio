"use client";

import { useState } from "react";
import Link from "next/link";

import { ArrowLeft, FolderPlus } from "lucide-react";

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

import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";

type ProjectFormValues = {
  name: string;
  description: string;
};

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createProject = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    setIsLoading(true);

    try {
      await createProject.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
      });

      form.reset();

      window.location.href = "/dashboard/projects";
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
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
        {/* Retour */}
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

        {/* Title */}
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
            <FolderPlus
              className="
                size-6
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

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
              Nouveau projet
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Créez un espace pour organiser votre contenu.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CARD
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
                PROJECT NAME
                ===================================== */}
            <FormField
              control={form.control}
              name="name"
              rules={{
                required:
                  "Le nom du projet est obligatoire.",
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
              {/* Annuler */}
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
                <Link href="/dashboard/projects">
                  Annuler
                </Link>
              </Button>

              {/* Créer */}
              <Button
                type="submit"
                disabled={isLoading}
                className="
                  rounded-xl
                  shadow-sm
                  shadow-sky-500/10
                "
              >
                {isLoading ? (
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
                    <FolderPlus className="mr-2 size-4" />
                    Créer le projet
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