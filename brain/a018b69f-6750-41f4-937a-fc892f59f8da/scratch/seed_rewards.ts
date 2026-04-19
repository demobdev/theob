import { api } from "../packages/backend/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

async function main() {
  console.log("Seeding Box Score Reward Definitions...");
  try {
    const result = await client.mutation(api.seedRewards.seedRewards, {});
    console.log("Success!", result);
  } catch (err) {
    console.error("Failed to seed rewards:", err);
  }
}

main();
