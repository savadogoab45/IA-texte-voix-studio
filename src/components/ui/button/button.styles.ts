import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-md",
    "font-medium",
    "transition-colors",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "cursor-pointer",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",

        secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",

        outline: "border border-slate-300 bg-transparent hover:bg-slate-100",

        ghost: "bg-transparent hover:bg-slate-100",

        danger: "bg-red-600 text-white hover:bg-red-700",

        link: "bg-transparent underline underline-offset-4 hover:text-blue-600",
      },

      size: {
        sm: "h-8 px-3 text-sm",

        md: "h-10 px-4 text-sm",

        lg: "h-12 px-6 text-base",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
