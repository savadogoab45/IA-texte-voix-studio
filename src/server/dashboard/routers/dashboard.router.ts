import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDashboardStats } from "../services/get-dashboard-stats.service";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return getDashboardStats({
      userId: ctx.session.user.id,
    });
  }),
});