import Link from "next/link";
import { BrainCircuit } from "lucide-react";

interface AuthHeaderProps {
  title?: string;
  description?: string;
}

export function AuthHeader({
  title = "Créer un compte",
  description = "Rejoignez AI Text Audio et commencez à générer du texte et de l'audio grâce à l'IA.",
}: Readonly<AuthHeaderProps>) {
  return (
    <>


    <div className="mb-4 text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-3"
      >
        <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 p-3 shadow-lg">
          <BrainCircuit className="size-6 text-white" />
        </div>
      </Link>
    </div>
    <div className="mb-6 text-center">
    <h1 className="mt-5 text-3xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-sm">
        {description}
      </p>
    </div>
    
    </>
  );
}