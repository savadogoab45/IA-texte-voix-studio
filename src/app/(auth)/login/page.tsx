import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Connexion"
        description="Connectez-vous à votre espace."
      />

      <LoginForm />

      <AuthFooter
        question="Vous n'avez pas de compte ?"
        href="/register"
        linkText="Créer un compte"
      />
    </AuthCard>
  );
}