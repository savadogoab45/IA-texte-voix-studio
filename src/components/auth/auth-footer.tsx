import Link from "next/link";

interface AuthFooterProps {
  question: string;
  href: string;
  linkText: string;
}

export function AuthFooter({
  question,
  href,
  linkText,
}: Readonly<AuthFooterProps>) {
  return (
    <p className="mt-6 text-center text-sm text-[#6b82a8] dark:text-blue-100">
      {question}{" "}
      <Link
        href={href}
        className="font-bold text-blue-600 hover:underline dark:text-cyan-300"
      >
        {linkText}
      </Link>
    </p>
  );
}
