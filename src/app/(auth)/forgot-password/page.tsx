import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Mot de passe oublié"
        description="Entrez votre adresse e-mail pour recevoir un lien de réinitialisation."
      />

      <ForgotPasswordForm />

      <AuthFooter
        question="Vous vous souvenez de votre mot de passe ?"
        href="/login"
        linkText="Se connecter"
      />
    </AuthCard>
  );
}