"use client";

import { authClient, useSession } from "@/lib/auth-client";

export function useAuth() {
  const session = useSession();

  return {
    ...session,
    authClient,
    user: session.data?.user,
    isAuthenticated: Boolean(session.data?.user)
  };
}
