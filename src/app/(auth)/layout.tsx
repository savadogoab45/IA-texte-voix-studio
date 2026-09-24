import { AuthShowcase } from "@/components/auth/auth-showcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f9ff] text-slate-950 dark:bg-[#020a1a] dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[60%_40%]">
        <AuthShowcase />
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_34%),linear-gradient(135deg,#f8fbff_0%,#eef7ff_48%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.28),transparent_34%),linear-gradient(135deg,#031024_0%,#061634_55%,#020817_100%)]" />
          <div className="absolute inset-y-0 left-0 hidden w-px bg-cyan-400/60 shadow-[0_0_36px_rgba(34,211,238,0.65)] dark:block" />
          <div className="relative z-10 w-full max-w-[520px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
} 
