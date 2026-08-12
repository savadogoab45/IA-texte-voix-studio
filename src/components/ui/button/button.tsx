import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";
import { buttonVariants } from "./button.styles";
import type { ButtonProps } from "./button.types";

export function Button({
  className,
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        leftIcon
      )}

      {children}

      {!loading && rightIcon}
    </button>
  );
}