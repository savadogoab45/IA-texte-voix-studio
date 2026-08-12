"use client";

import { useState } from "react";

import { Mail } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/validators/forgot-password.validator";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),

    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(
    values: ForgotPasswordSchema,
  ) {
  try {
        setIsLoading(true);

        console.log(values);
        

    setTimeout(() => {
      toast.success(
        "Un lien de réinitialisation a été envoyé."
      );

      setIsLoading(false);
    }, 1000);
    
  }catch (error) {
      console.error(error);

        toast.error("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    {...field}
                    className="h-11 pl-10"
                    placeholder="john@example.com"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

         <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500"
        >
             {isLoading ? (
    <>
      <span className="loading loading-spinner loading-sm"></span>
      {"Envoyer..."}
    </>
  ) : (
    "Envoyer le lien"
  )}
          {isLoading ? <span className="loading loading-spinner loading-sm"></span>
            : "Envoyer le lien"}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-sky-600 hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </form>
    </Form>
  );
}