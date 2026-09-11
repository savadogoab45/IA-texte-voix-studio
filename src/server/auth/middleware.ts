import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants";
import { auth } from "./auth";

export async function requireSession(redirectTo: string = ROUTES.DASHBOARD) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect(`${ROUTES.LOGIN}?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return session;
}
