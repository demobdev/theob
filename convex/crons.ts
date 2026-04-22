import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync-sportradar-games-30min",
  { minutes: 30 },
  api.sports_actions.scheduledSync,
);

export default crons;
