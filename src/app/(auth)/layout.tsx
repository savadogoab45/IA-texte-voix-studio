import { AuthShowcase } from "@/components/auth/auth-showcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div
        className="grid min-h-screen lg:grid-cols-[58%_42%]"
      >
        <AuthShowcase />
        <section
          className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10"
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
} 