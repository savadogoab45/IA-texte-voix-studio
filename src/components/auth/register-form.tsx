"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./password-input";
import { SocialLogin } from "./social-login";
import { registerSchema, type RegisterSchema } from "@/lib/validators/auth.validator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";




export function RegisterForm() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: RegisterSchema) {
    try {
      setIsLoading(true);

      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

     toast.success("Compte créé avec succès");

      router.push("/login");
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
        className="space-y-2.5"
      >

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-[#5f76ad] dark:text-blue-100/85">Nom complet</FormLabel>

              <FormControl>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#6b83bd] dark:text-blue-200" />

                  <Input
                    {...field}
                    placeholder="John Doe"
                    className="h-10.5 rounded-lg border-blue-100 bg-white/60 pl-10 text-sm shadow-none placeholder:text-[#8da0c9] focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/15 dark:border-blue-300/25 dark:bg-[#081a3c]/55 dark:placeholder:text-blue-200/60"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-[#5f76ad] dark:text-blue-100/85">Adresse e-mail</FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#6b83bd] dark:text-blue-200" />

                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    className="h-10.5 rounded-lg border-blue-100 bg-white/60 pl-10 text-sm shadow-none placeholder:text-[#8da0c9] focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/15 dark:border-blue-300/25 dark:bg-[#081a3c]/55 dark:placeholder:text-blue-200/60"
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
              <FormLabel className="text-xs font-semibold text-[#5f76ad] dark:text-blue-100/85">Mot de passe</FormLabel>

              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="********"
                  className="h-10.5 rounded-lg border-blue-100 bg-white/60 text-sm shadow-none placeholder:text-[#8da0c9] focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/15 dark:border-blue-300/25 dark:bg-[#081a3c]/55 dark:placeholder:text-blue-200/60"
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
              <FormLabel className="text-xs font-semibold text-[#5f76ad] dark:text-blue-100/85">Confirmer le mot de passe</FormLabel>

              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="********"
                  className="h-10.5 rounded-lg border-blue-100 bg-white/60 text-sm shadow-none placeholder:text-[#8da0c9] focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400/15 dark:border-blue-300/25 dark:bg-[#081a3c]/55 dark:placeholder:text-blue-200/60"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10.5 w-full cursor-pointer rounded-lg bg-linear-to-r from-sky-500 via-blue-600 to-violet-500 text-sm font-bold text-white shadow-[0_8px_18px_rgba(59,130,246,0.22)] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400"
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Créer un compte"}
        </Button>

        <SocialLogin />
      </form>
    </Form>
  );
}