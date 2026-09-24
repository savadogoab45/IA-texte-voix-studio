import {
  AudioLines,
  BrainCircuit,
  Globe2,
  Mic,
  Cloud,
} from "lucide-react";
import Image from "next/image";

import { Feature } from "./feature";
import { Stat } from "./stat";

export function AuthShowcase() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden lg:flex">
      <Image
        src="/images/ai-audio-hero-ligth.png"
        alt=""
        fill
        priority
        className="object-cover dark:hidden"
      />
      <Image
        src="/images/ai-audio-hero-dark.png"
        alt=""
        fill
        priority
        className="hidden object-cover dark:block"
      />
      <div className="absolute inset-0 bg-linear-to-b from-white/20 via-white/0 to-white/35 dark:from-[#020817]/20 dark:via-[#020817]/5 dark:to-[#020817]/45" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-white/85 to-transparent dark:from-[#031024]/90" />

      <div className="relative z-10 flex h-full min-h-screen w-full flex-col justify-between px-9 py-8 xl:px-12">
        <div className="flex items-center gap-2.5">
          <AudioLines className="h-7 w-7 text-blue-600 dark:text-cyan-300" />
          <span className="text-lg font-extrabold text-[#0b2b66] dark:text-white">
            AI Text Audio Studio
          </span>
        </div>

        <div className="mt-auto">
          <div className="grid grid-cols-4 gap-4">
            <Feature
              icon={<BrainCircuit />}
              title="Génération IA"
              description="Création de contenu intelligente"
            />

            <Feature
              icon={<Mic />}
              title="Voix naturelles"
              description="Des voix réalistes et expressives"
            />

            <Feature
              icon={<Globe2 />}
              title="Multilingue"
              description="Plusieurs langues et voix disponibles"
            />

            <Feature
              icon={<Cloud />}
              title="Cloud"
              description="Vos projets accessibles partout"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 border-t border-blue-200/80 pt-4 dark:border-cyan-300/25">
            <Stat number="50K+" label="Textes générés" />
            <Stat number="18K+" label="Audios créés" />
            <Stat number="99.9%" label="Disponibilité" />
          </div>
        </div>
      </div>
    </section>
  );
}
