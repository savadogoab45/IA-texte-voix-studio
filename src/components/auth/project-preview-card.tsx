import {
  CheckCircle2,
  FileText,
} from "lucide-react";

export function ProjectPreviewCard() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/20 p-2">
          <FileText className="size-5 text-white" />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Nouveau projet
          </h3>

          <p className="text-sm text-cyan-100">
            Présentation produit
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Row label="Modèle" value="GPT-4.1" />
        <Row label="Voix" value="Nova" />
        <Row label="Langue" value="Français" />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex justify-between text-sm text-cyan-100">
          <span>Génération</span>

          <span>100%</span>
        </div>

        <div className="h-2 rounded-full bg-white/20">
          <div className="h-2 w-full rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-emerald-200">
        <CheckCircle2 className="size-5" />

        <span className="text-sm">
          Génération terminée
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-cyan-100">
        {label}
      </span>

      <span className="font-medium text-white">
        {value}
      </span>
    </div>
  );
}