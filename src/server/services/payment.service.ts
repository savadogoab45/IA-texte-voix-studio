export async function ensureFreeSubscription(userId: string) {
  return {
    userId,
    plan: "FREE",
    status: "ACTIVE",
  };
}
