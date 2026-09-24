"use client";

import { Button } from "@/components/ui/button";

export function SocialLogin() {
  return (
    <div className="mt-3">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-blue-100 dark:bg-cyan-300/20" />

        <span className="text-sm text-[#7b91b5] dark:text-blue-100">
          Ou continuer avec
        </span>

        <div className="h-px flex-1 bg-blue-100 dark:bg-cyan-300/20" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-pointer rounded-xl border-blue-100 bg-white/55 font-bold text-[#244373] shadow-none hover:bg-blue-50 dark:border-cyan-300/20 dark:bg-[#0a244f]/60 dark:text-white dark:hover:bg-[#102c66]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 size-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.52z"
            />
            <path
              fill="#34A853"
              d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22z"
            />
            <path
              fill="#FBBC05"
              d="M6.41 13.9A6.01 6.01 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.51H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.49l3.34-2.59z"
            />
            <path
              fill="#EA4335"
              d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.86-2.86C16.96 3.01 14.7 2 12 2a10 10 0 0 0-8.93 5.51l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98z"
            />
          </svg>
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-pointer rounded-xl border-blue-100 bg-white/55 font-bold text-[#244373] shadow-none hover:bg-blue-50 dark:border-cyan-300/20 dark:bg-[#0a244f]/60 dark:text-white dark:hover:bg-[#102c66]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.9.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0 1 12 6.98c.85 0 1.7.11 2.5.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.58c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
          </svg>
          GitHub
        </Button>
      </div>
    </div>
  );
}
