import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.hourly(
  "sync-sportradar-games-hourly",
  { minuteUTC: 0 },
  api.sports_actions.scheduledSync,
);

export default crons;
