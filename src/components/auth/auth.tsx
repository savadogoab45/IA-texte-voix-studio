"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { authConfig } from "@/config/auth";
import { authClient } from "@/lib/auth-client";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Spinner } from "@/components/ui";

type AuthPath = "sign-in" | "sign-up" | "forgot-password" | "reset-password" | "sign-out";

const authViews: Record<AuthPath, { title: string; description: string; submit: string }> = {
  "sign-in": {
    title: "Connexion",
    description: "Retrouvez votre espace de generation texte et audio.",
    submit: "Se connecter"
  },
  "sign-up": {
    title: "Creation de compte",
    description: "Demarrez avec vos credits gratuits.",
    submit: "Creer mon compte"
  },
  "forgot-password": {
    title: "Mot de passe oublie",
    description: "Recevez un lien pour definir un nouveau mot de passe.",
    submit: "Envoyer le lien"
  },
  "reset-password": {
    title: "Nouveau mot de passe",
    description: "Choisissez un mot de passe securise.",
    submit: "Mettre a jour"
  },
  "sign-out": {
    title: "Deconnexion",
    description: "Votre session va etre fermee.",
    submit: "Se deconnecter"
  }
};

export function Auth({ path = "sign-in" }: { path?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const view = (Object.keys(authViews).includes(path) ? path : "sign-in") as AuthPath;
  const copy = authViews[view];
  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") ?? authConfig.afterSignInPath,
    [searchParams]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const client = authClient as any;

      if (view === "sign-in") {
        await client.signIn.email({ email, password, callbackURL: redirectTo });
        toast.success("Connexion reussie");
        router.push(redirectTo);
      }

      if (view === "sign-up") {
        await client.signUp.email({ name, email, password, callbackURL: redirectTo });
        toast.success("Compte cree");
        router.push(redirectTo);
      }

      if (view === "forgot-password") {
        await client.forgetPassword?.({
          email,
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        toast.success("Lien envoye si l'adresse existe");
      }

      if (view === "sign-out") {
        await client.signOut();
        router.push(authConfig.afterSignOutPath);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action impossible");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submit}>
          {view === "sign-up" ? (
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
          ) : null}

          {view !== "reset-password" && view !== "sign-out" ? (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          ) : null}

          {view === "sign-in" || view === "sign-up" || view === "reset-password" ? (
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete={view === "sign-up" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>
          ) : null}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner className="mr-2" /> : null}
            {copy.submit}
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          {view === "sign-in" ? <Link href="/auth/forgot-password">Mot de passe oublie</Link> : null}
          {view === "sign-in" ? <Link href="/auth/sign-up">Creer un compte</Link> : null}
          {view === "sign-up" ? <Link href="/auth/sign-in">J'ai deja un compte</Link> : null}
        </div>
      </CardContent>
    </Card>
  );
}
