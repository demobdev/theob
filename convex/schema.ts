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
    highlightVideoId: v.optional(v.string()), // YouTube 11-char ID
    lastSyncedAt: v.optional(v.string()),
  }).index("by_startsAt", ["startsAt"]).index("by_sport", ["sport"]).index("by_externalId", ["externalId"]),
  categories: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
    pointMultiplier: v.optional(v.number()),
  }),
  products: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    pointsWorth: v.optional(v.number()),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    isOutOfStock: v.optional(v.boolean()),
    isVisible: v.optional(v.boolean()),
    disclaimer: v.optional(v.string()),
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
              defaultSelected: v.optional(v.boolean()),
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
    phone: v.optional(v.string()),
    birthMonth: v.optional(v.string()),
    birthDay: v.optional(v.string()),
    lastBirthdayRewardYear: v.optional(v.number()),
    vehicle: v.optional(v.object({
      make: v.string(),
      model: v.string(),
      color: v.string(),
    })),
    smsConsent: v.optional(v.boolean()),
    marketingOptIn: v.optional(v.boolean()),
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

  receipt_submissions: defineTable({
    userId: v.string(),
    imageUrl: v.string(),
    amount: v.number(),
    receiptDate: v.string(),
    status: v.string(), // "pending", "approved", "rejected"
    pointsAwarded: v.optional(v.number()),
    processedAt: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),

  orders: defineTable({
    userId: v.string(),
    items: v.array(v.any()), // Mirroring POS order logic
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    pointsAwarded: v.number(),
    
    // Xenial POS Required Fields
    destination: v.optional(v.string()), // "In-Store Pickup", "Delivery", "Curbside"
    location: v.optional(v.string()), // e.g. "Greenville"
    customerPhone: v.optional(v.string()),
    pickupTime: v.optional(v.string()), // e.g., "10:30 am - 10:45 am"
    paymentStatus: v.optional(v.string()), // "pending", "paid"
    status: v.optional(v.string()), // "pending", "preparing", "ready", "completed", "cancelled"
    createdAt: v.optional(v.string()),
    
    // Fulfillment Details
    carDetails: v.optional(
      v.object({
        make: v.string(),
        model: v.string(),
        color: v.string(),
      })
    ),
    deliveryAddress: v.optional(
      v.object({
        firstName: v.string(),
        lastName: v.string(),
        address: v.string(),
        apt: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        instructions: v.optional(v.string()),
      })
    ),
  }).index("by_userId", ["userId"]),

  /**
   * payment_methods — stores tokenized card references ONLY.
   * Raw card numbers are NEVER stored. All sensitive data lives in
   * the GeniuS/Xenial secure vault. We hold only the opaque token
   * returned after tokenization, plus display metadata.
   */
  payment_methods: defineTable({
    userId: v.string(),           // Clerk subject ID
    gatewayToken: v.string(),     // Opaque token from GeniuS/Xenial vault
    brand: v.string(),            // "Visa" | "Mastercard" | "Amex" | "Discover"
    last4: v.string(),            // Last 4 digits for display only
    expMonth: v.string(),         // "04"
    expYear: v.string(),          // "2028"
    isDefault: v.boolean(),       // Whether this is the user's default card
    billingZip: v.optional(v.string()),
    nickname: v.optional(v.string()), // e.g. "My Visa"
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),
});

