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
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>

              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    {...field}
                    placeholder="John Doe"
                    className="h-10 pl-10"
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
              <FormLabel>Adresse e-mail</FormLabel>

              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    className="h-10 pl-10"
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
                  className="h-10"
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
                  placeholder="********"
                  className="h-10"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full cursor-pointer rounded-xl backdrop-blur-xl  hover:bg-white/15 bg-gradient-to-r from-sky-600 to-cyan-500"
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Créer un compte"}
        </Button>

        <SocialLogin />
      </form>
    </Form>
  );
}