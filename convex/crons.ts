import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync-espn-games-30min",
  { minutes: 30 },
  api.sports_actions.scheduledSync,
);

// Daily cleanup: purge finished games older than 3 days to stay under storage limits
crons.daily(
  "purge-old-games",
  { hourUTC: 6, minuteUTC: 0 }, // 6am UTC = 2am ET
  api.maintenance.purgeOldGames,
  { daysOld: 3 },
);

export default crons;
