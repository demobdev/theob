import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync-sports-espn-fallback-30min",
  { minutes: 30 },
  api.sports_actions.scheduledSyncWithFallback,
);

// Game-day promo pushes (future): cron here → internal.pushNotifications.sendPushToUser
// with requireMarketingOptIn: true for users with push_tokens + marketingOptIn.

export default crons;
