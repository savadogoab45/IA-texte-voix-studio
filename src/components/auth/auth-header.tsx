import Link from "next/link";
import { AudioLines } from "lucide-react";

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
      <div className="mb-2 text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="rounded-full bg-linear-to-br from-sky-400 via-blue-600 to-violet-500 p-2.5 shadow-lg shadow-blue-600/25 dark:shadow-cyan-400/20">
            <AudioLines className="size-5 text-white" />
          </div>
        </Link>
      </div>
      <div className="mb-4 text-center">
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#102d6b] dark:text-white">
          {title}
        </h1>

        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#5f76ad] dark:text-blue-100/85">
          {description}
        </p>
      </div>
    </>
  );
}
