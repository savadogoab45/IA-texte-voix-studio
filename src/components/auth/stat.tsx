import type { ReactNode } from "react";

interface StatProps {
  icon: ReactNode;
  number: string;
  label: string;
}

export function Stat({
  icon,
  number,
  label,
}: Readonly<StatProps>) {
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
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-white/15
        hover:shadow-2xl
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
        ">
        {icon}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white">
          {number}
        </h3>

        <p className="text-sm text-cyan-100">
          {label}
        </p>
      </div>
    </div>
  );
}