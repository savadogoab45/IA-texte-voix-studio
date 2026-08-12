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
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {question}{" "}
      <Link
        href={href}
        className="font-medium text-primary hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}