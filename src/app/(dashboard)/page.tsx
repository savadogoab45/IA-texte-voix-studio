export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-sky-600">
          Bienvenue 👋
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Votre espace de création
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Créez du contenu avec l&apos;IA, générez des voix
          naturelles et gérez tous vos projets au même endroit.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Générations
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Ce mois-ci
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Projets
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Projets créés
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Audio généré
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            0 min
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Temps audio
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Plan actuel
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            Free
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Plan gratuit
          </p>
        </div>
      </div>

      {/* Empty state */}
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Commencez votre première génération
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Créez du texte avec l&apos;IA ou transformez votre
          contenu en audio naturel.
        </p>
      </div>
    </div>
  );
}