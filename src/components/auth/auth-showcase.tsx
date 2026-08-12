import {
  BrainCircuit,
  Brain,
  Mic,
  Cloud,
} from "lucide-react";

{/*import { DashboardPreview } from "./dashboard-preview";*/ }
import { Feature } from "./feature";
import { Stat } from "./stat";

export function AuthShowcase() {
  return (
    <section className="relative hidden h-full overflow-hidden bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-500 lg:flex">
      {/* Halo */}
      <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between px-12 py-10">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
            <BrainCircuit className="size-6 text-white" />

            <span className="font-semibold text-white">
              AI Text Audio
            </span>
          </div>

          <h1
            className="mt-8 max-w-xl text-4xl font-bold leading-tight xl:text-5xl text-white"
          >
            Générez du texte avec l&apos;IA puis transformez-le en audio en quelques secondes.
          </h1>

          <p className="mt-5 max-w-lg text-lg text-cyan-50">
            Une plateforme complète permettant de créer,
            convertir et gérer tous vos contenus IA depuis
            une seule interface.
          </p>
        </div>
        {/* Dashboard 
          <div className="mt-8">
            <DashboardPreview />
          </div>
          */}

        <div className="mt-8 flex flex-col gap-4 lg:gap-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Feature
              icon={<Brain />}
              title="Génération IA"
              description="Créez du contenu de qualité instantanément."
            />

            <Feature
              icon={<Mic />}
              title="Voix naturelles"
              description="Convertissez vos textes avec des voix réalistes."
            />

            <Feature
              icon={<Cloud />}
              title="Synchronisation Cloud"
              description="Retrouvez vos projets partout."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            
            <Stat icon={<BrainCircuit />} number="50K+" label="Textes" />

            <Stat icon={<Mic />} number="18K+" label="Audios" />

            <Stat icon={<Cloud />} number="99.9%" label="Disponibilité" />

          </div>
        </div>
      </div>
    </section>
  );
}