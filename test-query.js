const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function main() {
  const games = await client.query("sports_queries:getGamesForDate", { targetDate: "2026-04-29" });
  console.log("Total games for 2026-04-29:", games.length);
  
  const allGames = await client.query("sports_queries:getTodayGames", {});
  console.log("Total getTodayGames:", allGames.length);
  
  const sportsCount = {};
  for(const g of allGames) {
    sportsCount[g.sport] = (sportsCount[g.sport] || 0) + 1;
  }
  console.log("Sports breakdown:", sportsCount);
}

main().catch(console.error);
