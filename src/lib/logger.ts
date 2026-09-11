export const logger = {
  info: (...args: unknown[]) => console.info("[app]", ...args),
  warn: (...args: unknown[]) => console.warn("[app]", ...args),
  error: (...args: unknown[]) => console.error("[app]", ...args)
};
