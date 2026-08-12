import { Mic, Play } from "lucide-react";

export function AudioPreviewCard() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="font-medium text-white">
          <Mic /> Audio Preview
        </span>

        <span className="text-cyan-100">
          01:28
        </span>
      </div>

      <div className="mt-5 h-2 rounded-full bg-white/20">
        <div className="h-2 w-2/3 rounded-full bg-white" />
      </div>

      <div className="mt-6 flex gap-2">
        <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700">
          <Play /> Lecture
        </button>

        <button className="rounded-full border border-white/30 px-5 py-2 text-sm text-white">
          Télécharger
        </button>
      </div>
    </div>
  );
}