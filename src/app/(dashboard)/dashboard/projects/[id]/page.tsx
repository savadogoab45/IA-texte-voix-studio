"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectOverviewPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.id as string;

  useEffect(() => {
    if (!projectId) {
      return;
    }

    router.replace(`/dashboard/projects/${projectId}/documents`);
  }, [projectId, router]);

  return (
    <div
      className="
        mx-auto
        flex
        min-h-[420px]
        w-full
        max-w-7xl
        items-center
        justify-center
        text-slate-500
        dark:text-slate-400
      "
    >
      <div className="flex items-center gap-3">
        <span
          className="
            size-5
            animate-spin
            rounded-full
            border-2
            border-slate-300
            border-t-sky-500
            dark:border-slate-700
            dark:border-t-sky-400
          "
        />
        Redirection vers le projet...
      </div>
    </div>
  );
}
