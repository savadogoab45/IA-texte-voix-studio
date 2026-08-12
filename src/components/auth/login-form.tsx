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
import { Mail } from "lucide-react";
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
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 pl-10"
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
              <FormLabel>Mot de passe</FormLabel>

              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="********"
                  className="h-11"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-sky-600 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {"Connexion..."}
            </>
          ) : (
            "Se connecter"
          )}
        </Button>

        <SocialLogin />
      </form>
    </Form>
  );
}