import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// ESPN status (scheduled → inprogress → closed) updates on this cadence;
// clients subscribe to getTodayGames and re-pick the Tonight card when rows change.
crons.interval(
  "sync-sports-espn-fallback-15min",
  { minutes: 15 },
  api.sports_actions.scheduledSyncWithFallback,
);

// Game-day promo pushes (future): cron here → internal.pushNotifications.sendPushToUser
// with requireMarketingOptIn: true for users with push_tokens + marketingOptIn.

export default crons;
