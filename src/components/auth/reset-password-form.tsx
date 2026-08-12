"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { PasswordInput } from "./password-input";

import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/validators/reset-password.validator";

export function ResetPasswordForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(
    values: ResetPasswordSchema,
  ) {
    setIsLoading(true);

    console.log(values);

    // Better Auth ici

    setTimeout(() => {
      alert("Mot de passe modifié.");

      router.push("/login");
    }, 1000);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>

              <FormControl>
                <PasswordInput
                  {...field}
                  className="h-11"
                  placeholder="********"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>

              <FormControl>
                <PasswordInput
                  {...field}
                  className="h-11"
                  placeholder="********"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {"Modification en cours..."}
            </>
          ) : (
            "Modifier le mot de passe"
          )}
        </Button>
      </form>
    </Form>
  );
}