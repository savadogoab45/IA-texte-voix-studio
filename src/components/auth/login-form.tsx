"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SocialLogin } from "./social-login";
import { signIn } from "@/lib/auth-client";
import {
  LoginSchema,
  type LoginInput,
} from "@/lib/validators/login.validator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    try {
      setIsLoading(true);

      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Vous êtes connecté avec succès");
      router.push("/dashboard");
    } catch (error) {
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
        className="space-y-3"
      >
        <div className="grid rounded-xl border border-blue-100 bg-blue-50/70 p-1 dark:border-cyan-300/20 dark:bg-[#0b2856]/70">
          <div className="grid grid-cols-2">
            <Link
              href="/login"
              className="rounded-lg bg-linear-to-r from-cyan-400 via-blue-600 to-violet-600 px-3 py-2 text-center text-xs font-extrabold text-white shadow-md shadow-blue-600/20"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="rounded-lg px-3 py-2 text-center text-xs font-semibold text-[#6b82a8] transition hover:text-blue-600 dark:text-blue-100 dark:hover:text-cyan-300"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-[#09245b] dark:text-white">
                Email
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6a83ad] dark:text-blue-200" />

                  <Input
                    {...field}
                    type="email"
                    placeholder="Votre adresse email"
                    className="h-10.5 rounded-lg border-blue-100 bg-white/70 pl-11 text-sm text-[#09245b] shadow-sm placeholder:text-[#9aacca] focus-visible:border-blue-400 focus-visible:ring-blue-400/20 dark:border-cyan-300/25 dark:bg-[#0a244f]/70 dark:text-white dark:placeholder:text-blue-200/70 dark:focus-visible:border-cyan-300 dark:focus-visible:ring-cyan-300/20"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-[#09245b] dark:text-white">
                Mot de passe
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-[#6a83ad] dark:text-blue-200" />
                  <PasswordInput
                    {...field}
                    placeholder="Votre mot de passe"
                    className="h-10.5 rounded-lg border-blue-100 bg-white/70 pl-11 text-sm text-[#09245b] shadow-sm placeholder:text-[#9aacca] focus-visible:border-blue-400 focus-visible:ring-blue-400/20 dark:border-cyan-300/25 dark:bg-[#0a244f]/70 dark:text-white dark:placeholder:text-blue-200/70 dark:focus-visible:border-cyan-300 dark:focus-visible:ring-cyan-300/20"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#244373] dark:text-blue-100">
            <input
              type="checkbox"
              className="size-4 rounded border-blue-300 bg-transparent accent-blue-600 dark:border-cyan-300"
            />
            Se souvenir de moi
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-blue-600 hover:underline dark:text-cyan-300"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10.5 w-full rounded-lg bg-linear-to-r from-cyan-400 via-blue-600 to-violet-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:brightness-110 dark:shadow-cyan-400/20"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {"Connexion..."}
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>

        <SocialLogin />
      </form>
    </Form>
  );
}
