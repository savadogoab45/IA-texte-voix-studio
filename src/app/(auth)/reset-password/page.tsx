import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Réinitialiser le mot de passe"
        description="Choisissez un nouveau mot de passe sécurisé."
      />

      <ResetPasswordForm />

      <AuthFooter
        question="Retour à la connexion ?"
        href="/login"
        linkText="Se connecter"
      />
    </AuthCard>
  );
}