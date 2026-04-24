import { query } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // 1. Orders Today
    const ordersToday = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("createdAt"), todayStart))
      .collect();

    // 2. Pending Receipts
    const pendingReceipts = await ctx.db
      .query("receipt_submissions")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // 3. Active Loyalty Members (Total profiles)
    const members = await ctx.db.query("user_profiles").collect();

    // 4. Points Issued Today (Earning events in ledger)
    const ledgerToday = await ctx.db
      .query("points_ledger")
      .filter((q) => q.gte(q.field("createdAt"), todayStart))
      .collect();
    
    const pointsIssued = ledgerToday
      .filter(l => l.type === "earned" || l.type === "earning" || l.type === "bonus")
      .reduce((acc, curr) => acc + Math.abs(curr.points), 0);

    const pointsRedeemed = ledgerToday
      .filter(l => l.type === "redeemed")
      .reduce((acc, curr) => acc + Math.abs(curr.points), 0);

    return {
      ordersCount: ordersToday.length,
      pendingReceiptsCount: pendingReceipts.length,
      memberCount: members.length,
      pointsIssued,
      pointsRedeemed,
      revenueToday: ordersToday.reduce((acc, curr) => acc + curr.total, 0),
    };
  },
});
