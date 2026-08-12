import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { db } from "@/server/db";
import { env } from "@/env";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  baseURL: env.BETTER_AUTH_URL,

  trustedOrigins: [env.BETTER_AUTH_URL],

  emailAndPassword: {
    enabled: true,
  },
});
