const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function main() {
  const games = await client.query("sports_queries:getGamesForDate", { targetDate: "2026-04-29" });
  for (const g of games) {
    console.log(`[${g.sport}] ${g.homeTeam?.name} vs ${g.awayTeam?.name} - ${g.startsAt}`);
  }
}

main().catch(console.error);
