import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync-sports-espn-fallback-30min",
  { minutes: 30 },
  api.sports_actions.scheduledSyncWithFallback,
);

export default crons;
