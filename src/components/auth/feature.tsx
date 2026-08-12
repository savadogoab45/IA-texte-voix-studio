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
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-white/20
        bg-white/10
        p-4
        mb-4
        w-full
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-white/15
        hover:shadow-2xl
        sm:flex-col
        sm:items-start
        sm:gap-2
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white/15
          text-white
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-cyan-100">
          {description}
        </p>
      </div>
    </div>
  );
}