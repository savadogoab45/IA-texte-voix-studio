import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Bienvenue !"
        description="Connectez-vous à votre compte pour accéder à votre studio de création audio."
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
