import { Sparkles } from "lucide-react";

export function GeneratedTextCard() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
      <span className="text-sm font-medium text-cyan-100">
        <Sparkles /> Texte généré
      </span>

      <p className="mt-4 text-sm leading-7 text-white/90">
        Bienvenue sur AI Text Audio.

        Notre intelligence artificielle peut générer des
        articles, scripts vidéo, publications pour les réseaux
        sociaux et bien plus encore.

        Transformez ensuite votre texte en voix réaliste en un
        seul clic.
      </p>
    </div>
  );
}