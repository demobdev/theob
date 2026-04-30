
import { query } from "./_generated/server";

export default query({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db.query("upcoming_games").collect();
    const sports = new Set(games.map(g => g.sport));
    return Array.from(sports);
  }
});
