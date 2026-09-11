import { notFound } from "next/navigation";

import { Auth } from "@/components/auth/auth";

const paths = ["sign-in", "sign-up", "forgot-password", "reset-password", "sign-out"];

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  if (!paths.includes(path)) {
    notFound();
  }

  return (
    <main className="surface-grid grid min-h-screen place-items-center px-4 py-10">
      <Auth path={path} />
    </main>
  );
}
