# The Owner's Box — Systems Architecture

Single-location MVP: **Greenville, SC** (`greenville_01`). Multi-location later.

## High-level diagram

```mermaid
flowchart TB
  subgraph clients [Clients]
    Native[Expo apps/native]
    Web[Next.js apps/web]
  end

  subgraph auth [Auth]
    Clerk[Clerk]
  end

  subgraph backend [Convex c:/dev/theob/convex]
    Orders[orders.ts]
    Products[products.ts]
    Loyalty[loyalty.ts]
    Sports[sports/* + crons]
    Admin[admin_*]
    GeniusHook[integrations/genius - planned]
  end

  subgraph external [External - planned or partial]
    GeniusPOS[Genius / Xenial POS xooapi]
    ESPN[ESPN scoreboard APIs]
    TheSportsDB[TheSportsDB fallback]
    Partners[DoorDash / Uber / Grubhub - links only]
  end

  Native --> Clerk
  Web --> Clerk
  Native --> backend
  Web --> backend
  Clerk --> backend
  Orders --> GeniusHook
  GeniusHook --> GeniusPOS
  Sports --> ESPN
  Sports --> TheSportsDB
```

## Repositories in this monorepo

| Path | Role |
|------|------|
| [`apps/native`](../apps/native) | Customer mobile app (ordering, loyalty, games) |
| [`apps/web`](../apps/web) | Marketing + admin dashboard |
| [`convex`](../convex) | API, database, crons, future POS actions |
| [`packages/backend`](../packages/backend) | Legacy stub — **do not use** |

## Data domains

| Domain | Tables / modules | Client surfaces |
|--------|------------------|-----------------|
| Menu | `categories`, `products` | MenuScreen, web menu |
| Cart | Local AsyncStorage + `CartContext` | CartScreen |
| Fulfillment prefs | `OrderContext` AsyncStorage | PreferencesModal, OrderHeader |
| Orders | `orders` | Cart checkout, OrderHistory, admin |
| Payments | `payment_methods` | AddCard, SavedCards — **mock tokenize today** |
| Loyalty | `user_profiles`, `points_ledger`, `reward_definitions` | Rewards, CollectPoints |
| Sports | `upcoming_games` | LiveGamesScreen |
| Admin | `admin_*` | web `/admin` |

## Order / pickup flow (today)

```mermaid
sequenceDiagram
  participant User
  participant Cart as CartScreen
  participant Prefs as PreferencesModal
  participant Convex as placeOrder mutation
  participant POS as Genius/Xenial

  User->>Prefs: In-store / Curbside / Delivery
  User->>Prefs: Phone, time, vehicle if curbside
  User->>Cart: Checkout
  Cart->>Convex: placeOrder (no payment capture)
  Note over Convex,POS: console.log mock only
  Convex--xPOS: not connected
  Convex->>User: success + points
```

## Order / pickup flow (target)

```mermaid
sequenceDiagram
  participant User
  participant App
  participant Convex
  participant Genius as Genius POS API
  participant Kitchen

  User->>App: Pay + place order
  App->>Convex: placeOrder
  Convex->>Convex: schedule submitToGenius action
  Convex->>Genius: Create/check order + payment token
  Genius->>Kitchen: Ticket on KDS / rack
  Genius-->>Convex: Webhook or poll: preparing / ready
  Convex->>App: Push notification order ready
```

## Greenville location (canonical)

See [`convex/lib/locations.ts`](../convex/lib/locations.ts).

## Genius / Xenial naming

In code and comments we use **GeniuS/Xenial** (Heartland / Global Payments restaurant platform). Restaurant staff may call it **Genius POS**. Integration doc: [`convex/integrations/genius/README.md`](../convex/integrations/genius/README.md).

## Production gaps (prioritized)

See [`OB_PRE_LAUNCH_PLAN.md`](../OB_PRE_LAUNCH_PLAN.md) and [`docs/GENIUS_POS_ROADMAP.md`](GENIUS_POS_ROADMAP.md).
