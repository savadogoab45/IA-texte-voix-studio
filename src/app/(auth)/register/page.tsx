import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthCard>
      <AuthHeader />

      <RegisterForm />

      <AuthFooter
        question="Vous avez déjà un compte ?"
        href="/login"
        linkText="Se connecter"
      />
    </AuthCard>
  );
}