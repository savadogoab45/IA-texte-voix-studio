import type { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function Feature({
  icon,
  title,
  description,
}: Readonly<FeatureProps>) {
  return (
    <div
      className="
        min-h-27
        rounded-2xl
        border
        border-white/55
        bg-white/30
        p-3
        w-full
        shadow-xl
        shadow-blue-950/5
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-white/45
        dark:border-cyan-300/15
        dark:bg-[#061b3d]/45
        dark:shadow-cyan-950/20
        dark:hover:bg-[#0a2450]/55
      "
    >
      <div
        className="
          grid
          h-9
          w-9
          shrink-0
          place-items-center
          rounded-full
          border
          border-white/60
          bg-white/70
          text-blue-600
          shadow-lg
          shadow-blue-600/15
          dark:border-cyan-300/25
          dark:bg-[#102c66]/70
          dark:text-cyan-300
        "
      >
        {icon}
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="text-sm font-extrabold text-[#09245b] dark:text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[#244373] dark:text-cyan-100">
          {description}
        </p>
      </div>
    </div>
  );
}
