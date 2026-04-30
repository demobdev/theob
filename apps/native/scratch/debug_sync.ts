
import { fetchEspnScoreboard } from "../../convex/sports/espn/client";

async function debug() {
    const sport = "basketball";
    const league = "nba";
    const dateStr = "20260430";
    
    console.log(`Fetching ${sport}/${league} for ${dateStr}...`);
    const scoreboard = await fetchEspnScoreboard(sport as any, league as any, dateStr);
    
    const events = scoreboard.events || [];
    console.log(`Found ${events.length} events`);
    
    events.forEach((event: any, i: number) => {
        const isUpcoming = event.status.type.state === 'pre';
        console.log(`Game ${i}: ${event.name} - State: ${event.status.type.state} - isUpcoming: ${isUpcoming}`);
    });
}

debug().catch(console.error);
