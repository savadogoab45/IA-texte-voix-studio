interface StatProps {
  number: string;
  label: string;
}

export function Stat({
  number,
  label,
}: Readonly<StatProps>) {
  return (
    <div
      className="
        border-blue-200/80
        px-3
        text-center
        first:border-r
        last:border-l
        dark:border-cyan-300/20
      "
    >
      <h3 className="bg-linear-to-r from-sky-500 via-blue-600 to-violet-600 bg-clip-text text-2xl font-black text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-fuchsia-400">
        {number}
      </h3>

      <p className="mt-1 text-xs font-medium text-[#42608f] dark:text-cyan-100">
        {label}
      </p>
    </div>
  );
}
