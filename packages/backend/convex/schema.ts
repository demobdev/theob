import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  upcoming_games: defineTable({
    externalId: v.string(),
    sport: v.string(),
    league: v.string(),
    status: v.string(),
    startsAt: v.string(),
    startsAtLocal: v.optional(v.string()),
    homeTeam: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        abbr: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        wins: v.optional(v.number()),
        losses: v.optional(v.number()),
        runs: v.optional(v.number()),
        hits: v.optional(v.number()),
        errors: v.optional(v.number()),
        score: v.optional(v.number()),
        probablePitcher: v.optional(
          v.object({
            fullName: v.string(),
            wins: v.optional(v.number()),
            losses: v.optional(v.number()),
            era: v.optional(v.number()),
          })
        ),
      })
    ),
    awayTeam: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        abbr: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        wins: v.optional(v.number()),
        losses: v.optional(v.number()),
        runs: v.optional(v.number()),
        hits: v.optional(v.number()),
        errors: v.optional(v.number()),
        score: v.optional(v.number()),
        probablePitcher: v.optional(
          v.object({
            fullName: v.string(),
            wins: v.optional(v.number()),
            losses: v.optional(v.number()),
            era: v.optional(v.number()),
          })
        ),
      })
    ),
    tournamentName: v.optional(v.string()),
    venue: v.optional(
      v.object({
        name: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        capacity: v.optional(v.number()),
        surface: v.optional(v.string()),
        stadiumType: v.optional(v.string()),
        fieldOrientation: v.optional(v.string()),
      })
    ),
    weather: v.optional(
      v.object({
        tempF: v.optional(v.number()),
        condition: v.optional(v.string()),
        humidity: v.optional(v.number()),
        windSpeedMph: v.optional(v.number()),
        windDirection: v.optional(v.string()),
      })
    ),
    broadcast: v.optional(v.string()),
    dayNight: v.optional(v.string()),
    doubleHeader: v.optional(v.boolean()),
    attendance: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
    featuredRank: v.optional(v.number()),
    isPrimeTime: v.optional(v.boolean()),
    tvZone: v.optional(v.string()), // e.g., "ZONE A", "MAIN JUMBOTRON"
    editorialNote: v.optional(v.string()),
    lastSyncedAt: v.optional(v.string()),
  }).index("by_startsAt", ["startsAt"]).index("by_sport", ["sport"]).index("by_externalId", ["externalId"]),
  categories: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
  }),
  products: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    modifiers: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.string(),
          required: v.optional(v.boolean()),
          maxSelection: v.optional(v.number()),
          options: v.array(
            v.object({
              name: v.string(),
              priceExtra: v.number(),
            })
          ),
        })
      )
    ),
  }).index("by_category", ["categoryId"]),

  user_profiles: defineTable({
    userId: v.string(), // Clerk Subject ID
    points: v.number(),
    lifetimePoints: v.number(),
    lastPointsUpdate: v.string(),
  }).index("by_userId", ["userId"]),

  reward_definitions: defineTable({
    title: v.string(),
    pointsCost: v.number(),
    rewardType: v.string(), // "free_item" | "discount" | "bundle"
    category: v.string(), // "Easy Wins", "Strong Mid-Tier", etc.
    eligibleMenuItemIds: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  }),

  points_ledger: defineTable({
    userId: v.string(),
    points: v.number(),
    type: v.string(), // "earned" | "redeemed" | "bonus"
    reason: v.string(), // "Order #123", "Game Day Bonus"
    orderId: v.optional(v.id("orders")),
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),

  orders: defineTable({
    userId: v.string(),
    items: v.array(v.any()),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    pointsAwarded: v.number(),
    status: v.string(), // "pending", "completed"
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),
});
