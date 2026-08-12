import {
  AudioLines,
  BrainCircuit,
  FolderOpen,
  Sparkles,
} from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan-100">
            Tableau de bord
          </p>

          <h3 className="mt-1 text-xl font-bold text-white">
            1 245 générations
          </h3>
        </div>

        <div className="rounded-2xl bg-white/15 p-3">
          <BrainCircuit className="size-6 text-white" />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6 space-y-4">
        <Progress
          label="Texte IA"
          value="92%"
          width="w-[92%]"
        />

        <Progress
          label="Audio"
          value="78%"
          width="w-[78%]"
        />

        <Progress
          label="Export"
          value="100%"
          width="w-full"
        />
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <MiniCard
          icon={<Sparkles className="size-4" />}
          title="GPT-4.1"
        />

        <MiniCard
          icon={<AudioLines className="size-4" />}
          title="ElevenLabs"
        />

        <MiniCard
          icon={<FolderOpen className="size-4" />}
          title="Cloud"
        />
      </div>
    </div>
  );
}

interface ProgressProps {
  label: string;
  value: string;
  width: string;
}

function Progress({
  label,
  value,
  width,
}: ProgressProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-cyan-100">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 rounded-full bg-white/20">
        <div
          className={`h-2 rounded-full bg-white ${width}`}
        />
      </div>
    </div>
  );
}

interface MiniCardProps {
  icon: React.ReactNode;
  title: string;
}

function MiniCard({
  icon,
  title,
}: MiniCardProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
      <div className="mb-2 text-white">
        {icon}
      </div>

      <p className="text-xs font-medium text-white">
        {title}
      </p>
    </div>
  );
}