Perfect. Your code agent gave the **bones**. My job here is to make sure the thing has a **sellable shape**, sane rollout, and doesn’t become a cursed admin panel with 47 tabs and no real leverage.

Here’s the middle-ground plan I’d hand back to the agent.

## What we are actually building

Not “a Thanx clone.”

Not “just a settings page.”

We’re building:

**A restaurant admin dashboard with a loyalty operating system at its core, designed to plug into web, app, and POS.**

That matches your original goal and keeps the V1 narrow enough to ship fast while still setting up the reusable product later. 

---

# Final product direction for V1

## V1 dashboard modules

These are the modules I would lock for the first real build:

1. **Overview**
2. **Orders**
3. **Customers**
4. **Loyalty**
5. **Promos / Rewards**
6. **POS / Integrations**
7. **Sports / War Room**
8. **Notifications**
9. **Analytics**
10. **Settings / Staff**

That keeps the dashboard coherent with what your code agent already outlined, but makes **Loyalty** the hero instead of one random feature buried under settings.

---

# What each section should do

## 1) Overview

This is the owner’s control room.

Show:

* total orders today
* app orders today
* loyalty members
* rewards redeemed
* live POS sync status
* sports sync status
* top campaign / promo
* failed orders needing attention

This page should feel like:
**“Is the machine alive, and where is money leaking?”**

---

## 2) Orders

This is not just a list. It’s an operations panel.

Show:

* real-time order feed
* source: app / web / POS / manual
* status: pending / injected / failed / refunded / completed
* payment status
* loyalty attached yes/no
* retry injection button
* manual reconcile button

This is where Xenial/Genius weirdness gets surfaced instead of hidden under the rug.

---

## 3) Customers

This becomes your light CRM.

Search by:

* phone
* email
* name
* loyalty ID

Profile drawer:

* points balance
* lifetime spend
* last order
* favorite team
* notification opt-ins
* loyalty rewards history
* manual notes
* manual points adjustment
* reward reissue

Do not overbuild segmentation UI yet. Just make the customer profile actually useful.

---

## 4) Loyalty

This is the core tab.

### Inside Loyalty, use sub-tabs:

* Program
* Rewards
* Members
* Campaigns
* Activity
* Analytics

### Program

Controls:

* loyalty on/off
* enrollment on/off
* app/web display toggles
* auto-enroll at checkout
* earn rule: points per dollar
* first app order bonus
* birthday reward
* double points day
* expiration rules
* terms/version
* preview card

### Rewards

CRUD for:

* free appetizer
* free drink
* free dessert
* dollar-off
* percent-off
* special menu reward

Fields:

* name
* description
* type
* points cost
* active/inactive
* channel availability
* linked POS item ID / discount rule
* start/end date
* stackable
* image/icon

### Members

* searchable table
* member details drawer
* points adjustment modal
* issue courtesy reward
* audit history

### Campaigns

For V1 only:

* first app order bonus
* birthday reward
* double points day
* win-back reward for inactive guests

That is enough. No drag-and-drop automation Disneyland yet.

### Activity

Real-time ledger/event stream:

* points earned
* points reversed
* reward unlocked
* reward redeemed
* refund adjustment
* manual admin action

### Analytics

* member growth
* redemption rate
* active members
* points issued vs redeemed
* loyalty sales attributed
* repeat rate
* app adoption

---

## 5) Promos / Rewards

Separate this from loyalty conceptually, even if some logic overlaps.

This is for:

* general discount offers
* POS-linked pricing rules
* event/game-day specials
* app-only promos
* web-only promos

Why separate it? Because later not every promo should require loyalty enrollment.

---

## 6) POS / Integrations

This is where your agent’s technical structure really matters.

### Cards / panels:

* Xenial / Genius connection status
* sandbox mode on/off
* token presence
* store/location mapping
* menu sync status
* order injection health
* retry queue
* latest errors

### Actions:

* validate connection
* sync menu now
* sync locations
* test order injection
* refresh pricing rules
* replay failed order

This page should scream:
**“We know integrations break. Here’s where you punch them in the face.”**

---

## 7) Sports / War Room

This is your differentiator, not fluff.

Show:

* sports API sync health
* latest sync timestamp
* force sync buttons by league
* current headliner games
* manual override for game card
* fallback editor if API misses something

This keeps the sports experience operational and gives staff a way to fix it manually when APIs decide to have a spiritual crisis.

---

## 8) Notifications

Channels:

* push
* SMS
* maybe email later

V1:

* game-day alerts
* reward unlocked
* reward expires soon
* birthday reward
* promo blast

Also include:

* segment selector
* estimated audience size
* preview message
* schedule now/later

Do not build a full marketing automation platform yet.

---

## 9) Analytics

Three views:

### Operations

* order volume
* failed injections
* sync health
* redemptions by day

### Loyalty

* points economy
* repeat purchase lift
* member vs non-member order frequency

### Sports engagement

* which games drive orders
* which teams drive opens / alerts
* game-day conversion lift

---

## 10) Settings / Staff

* Clerk admin role management
* location settings
* loyalty defaults
* POS credentials status
* feature flags
* branding controls

---

# The technical architecture your agent should build toward

Your agent is right to use shared backend logic. Keep that.

## Architecture direction

* **Next.js App Router** for admin
* **Convex** as the shared operational backend
* **Clerk** for auth / role gating
* **Shared source of truth** between app and dashboard
* **External integrations via Convex actions**
* **No POS or API secrets client-side**

That part is exactly right.

## But here’s the important product-level correction:

Do **not** make the POS the brain of loyalty.

The POS is an input/output system.
Your **loyalty ledger** is the brain.

That means:

### Core services

* customer service
* loyalty ledger service
* rewards service
* campaigns service
* order ingestion service
* POS adapter service
* sports sync service
* notifications service
* analytics service

---

# The key design decision: loyalty ledger first

Your agent needs to explicitly build a ledger model, not just mutable point balances.

## Required loyalty events

* member_created
* points_earned
* points_adjusted
* reward_unlocked
* reward_redeemed
* reward_voided
* order_linked
* order_refunded
* points_reversed
* campaign_bonus_applied

Why this matters:

* disputes become solvable
* refunds can reverse correctly
* POS sync can be reconciled
* analytics become trustworthy

Without that, loyalty turns into “trust me bro” accounting. Bad scene.

---

# The POS adapter abstraction to give your agent

This is the exact middle ground between your technical agent and product vision.

## Define a provider interface

### `POSProviderAdapter`

Methods:

* `validateConnection()`
* `fetchLocations()`
* `fetchMenu()`
* `fetchOrders(start, end)`
* `fetchCustomerByPhone(phone)`
* `syncOrder(orderPayload)`
* `syncRefund(refundPayload)`
* `createPromoRule(rulePayload)`
* `voidPromoRule(ruleId)`
* `applyRewardRedemption(redemptionPayload)`
* `voidRewardRedemption(redemptionId)`

Then implement:

* `GenesisGeniusAdapter` first
* future adapters later if you want to productize

This is how you keep the dashboard reusable for other restaurants later instead of handcuffing yourself to one stack.

Xenial’s current public product positioning explicitly supports connecting your own app, using the same POS data as a source of truth for menu/pricing, and injecting orders directly into the POS, which fits this adapter-based model well. ([Xenial][1])

---

# What your agent should prioritize first

## Build order

### Phase A — foundation

* admin auth + role gating
* dashboard shell
* overview page
* loyalty schema
* reward definitions schema
* customer search
* order monitoring
* integration status cards

### Phase B — loyalty core

* program settings
* rewards CRUD
* loyalty ledger
* manual adjustments
* member detail drawer
* redemption flow
* analytics cards

### Phase C — integrations

* Xenial/Genius adapter skeleton
* sandbox connection test
* menu sync
* order injection monitor
* promo rule sync
* failed order replay

### Phase D — sports + notifications

* Sportradar sync health
* manual override tools
* push/SMS event templates
* segment-based alerts

---

# What keys / credentials you need to grab

Here’s the practical part.

## 1) Clerk

Needed for admin auth and roles.

Grab:

* Clerk publishable key
* Clerk secret key
* webhook signing secret if using webhooks
* admin role strategy decision:

  * publicMetadata role, or
  * Organizations if you want multi-staff later

Clerk’s current docs support RBAC using metadata in apps not using Organizations, and `publicMetadata` is readable on frontend but only writable from the backend. Middleware is the right place to protect admin routes. ([Clerk][2])

### Minimum envs

* `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
* `CLERK_SECRET_KEY`

Optional:

* `CLERK_WEBHOOK_SECRET`

---

## 2) Convex

Needed for backend functions and environment storage.

Grab:

* Convex deployment URL / deployment identifier
* Convex admin/deploy token if required for CI
* environment variable access set up

Likely envs:

* `CONVEX_DEPLOYMENT`
* `NEXT_PUBLIC_CONVEX_URL`

---

## 3) Xenial / Genius POS

This is the big one.

Grab:

* sandbox base URL
* integrator token / API token
* merchant/store identifier
* location IDs
* menu/location mapping IDs
* any order injection endpoint details
* pricing/promo rule endpoint access
* webhook/event callback details if available
* IP allowlist requirements if any
* test credentials / sample store data

Since you already mentioned developer onboarding + integrator token, ask for:

* **sandbox credentials**
* **test merchant account**
* **store/location IDs**
* **menu sync docs**
* **order injection docs**
* **promo/discount rule docs**
* **refund/void behavior docs**
* **webhook/event docs**
* **rate limits**
* **error code list**

Do not just ask for “the token.”
That’s rookie bait. You need the surrounding map too.

---

## 4) Sportradar

Grab:

* API key
* sport/league access list
* trial vs production status
* allowed endpoints for schedules / live scores / daily changes
* rate limits

Sportradar’s docs show separate league-oriented schedule feeds and change-log patterns, so your agent should know exactly which leagues/endpoints are enabled before wiring the sync jobs. ([Getting Started][3])

---

## 5) Twilio

For SMS.

Grab:

* account SID
* auth token
* messaging service SID or Twilio phone number
* approved sender / compliance setup
* webhook URL for delivery status if you want analytics

Twilio’s current Messaging API and quickstart docs confirm you’ll need the account SID and auth token, and using a Messaging Service is the sane path once you go beyond toy mode. ([Twilio][4])

### Minimum envs

* `TWILIO_ACCOUNT_SID`
* `TWILIO_AUTH_TOKEN`
* `TWILIO_MESSAGING_SERVICE_SID`
  or
* `TWILIO_PHONE_NUMBER`

---

## 6) Push notifications

Depends on your app stack.

If Expo:

* Expo push config
* Apple APNs setup for iOS
* Firebase config for Android

If native later:

* APNs key
* Firebase server credentials

---

## 7) Payments / ordering

If your site/app ordering stack already exists, also grab:

* payment processor webhook secret
* order webhook secret
* any internal order service keys
* menu/media CDN access if needed

---

# Recommended environment variable list

This is the cheat sheet I’d hand the agent.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

XENIAL_SANDBOX_BASE_URL=
XENIAL_INTEGRATOR_TOKEN=
XENIAL_MERCHANT_ID=
XENIAL_LOCATION_ID=
XENIAL_BRAND_ID=
XENIAL_WEBHOOK_SECRET=

SPORTRADAR_API_KEY=
SPORTRADAR_LEAGUES=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_STATUS_CALLBACK_URL=

EXPO_ACCESS_TOKEN=
APNS_KEY_ID=
APNS_TEAM_ID=
APNS_PRIVATE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Maybe not all of these on day one, but this is the right hunting list.

---

# What to tell your coding agent

Here’s the clean message to send back:

## Build directive

* Keep the existing stack: Next.js + Convex + Clerk.
* Treat Convex as the single source of truth for admin + app.
* Build the dashboard around these first-class modules: Overview, Orders, Customers, Loyalty, POS/Integrations, Sports/War Room, Notifications, Analytics, Settings.
* Make **Loyalty** the central system, backed by a ledger/event model, not just a points balance field.
* Implement a `POSProviderAdapter` interface before wiring Genius/Xenial directly.
* Build Xenial/Genius as the first provider adapter.
* Expose integration health, sync controls, retries, and manual overrides in the dashboard.
* Keep campaign tools template-based for V1, not a full automation builder.
* Use Clerk middleware and admin role metadata to gate dashboard access.
* Put all external service secrets in Convex env vars.
* Ship the narrowest credible V1 first, then layer in automation/referrals/advanced segmentation.

---

# My blunt recommendation

Do **not** let the first version become:

* loyalty platform
* CRM
* marketing automation suite
* franchise manager
* analytics warehouse
* POS middleware
* sports CMS
* notification engine

…all at once.

That’s how founders end up “building a dashboard” for six weeks and still can’t comp a free queso.

Build the machine that proves:

1. customers earn points,
2. rewards can be redeemed,
3. orders sync cleanly,
4. sports data enhances engagement,
5. admins can operate it without calling you every ten minutes.

That’s the real V1.

If you want, I’ll turn this into a **tight agent-ready spec doc** with:

* route tree
* page-by-page component list
* Convex schema
* adapter interfaces
* env checklist
* launch order.

[1]: https://www.xenial.com/products/omni-channel/?utm_source=chatgpt.com "Mobile Ordering, Online Ordering, and In-app ..."
[2]: https://clerk.com/docs/guides/secure/basic-rbac?utm_source=chatgpt.com "Implement basic Role Based Access Control (RBAC) with ..."
[3]: https://developer.sportradar.com/getting-started/docs/get-started?utm_source=chatgpt.com "Sportradar API Documentation"
[4]: https://www.twilio.com/docs/messaging/api?utm_source=chatgpt.com "Messaging API Overview"

# The Owner’s Box Admin Dashboard — Consolidated Handoff

## Purpose

This document wraps up the product, architecture, data, and implementation decisions from the last two conversations so the coding agent can build the admin dashboard without drifting into a rewrite.

The goal is **not** to build a full Thanx clone right now.

The goal is to build a **high-performance admin dashboard** for The Owner’s Box that acts as:

* an operator console for the current app
* a self-service loyalty management system
* a control surface over the existing Convex backend
* the foundation for a reusable restaurant product later

---

## Product North Star

Build:

**A restaurant admin dashboard with a loyalty operating system at its core, designed to plug into web, app, sports data, and POS.**

V1 should prove these 5 things:

1. customers can earn points
2. rewards can be redeemed
3. admins can manage the loyalty program without developer help
4. orders and menu can be monitored/updated from one place
5. sports data can be managed operationally when the API needs help

Do **not** try to build all of these in V1:

* full CRM suite
* enterprise automation builder
* franchise management platform
* omnichannel marketing suite
* full POS middleware layer
* full Thanx feature parity

That would be a very efficient way to build nothing.

---

## Current Stack / Constraints

* **Frontend admin**: Next.js in `apps/web`
* **Backend**: Convex
* **Auth**: Clerk
* **Shared source of truth**: Admin dashboard must use the same Convex deployment as the mobile app
* **Aesthetic**: premium dark-mode, sports-bar "war room" feel

Recommended UI direction:

* sidebar layout
* shadcn/ui
* high-density data tables
* charts/cards for top-level metrics
* real-time operational feel

---

## Existing Convex Functions Already Available

### Loyalty

* `loyalty.getUserProfile`
* `loyalty.ensureUser`
* `loyalty.getPointsHistory`
* `loyalty.getRewardDefinitions`
* `loyalty.redeemReward`
* `loyalty.submitReceipt`
* `loyalty.syncUserProfile`
* `loyalty.updateUserVehicle`
* `loyalty.checkBirthdayReward`

### Orders

* `orders.placeOrder`
* `orders.getOrderHistory`

### Products

* `products.getCategories`
* `products.getFeaturedProducts`
* `products.getProductsByCategory`
* `products.getAllProducts`
* `products.seed`
* `products.seedMenu:populate`
* `products.seedRewards`

### Sports

* `sports_actions.scheduledSync`
* `sports_actions.clearStaleGames`
* `sports_actions.getGamesNeedingHighlights`
* `sports_actions.setGameHighlight`
* `sports_actions.fetchAllHighlights`
* `sports_mutations.upsertGames`
* `sports_mutations.deleteStaleGames`
* `sports_queries.getLiveGames`
* `sports_queries.getUpcomingGames`
* `sports_queries.getGamesForDate`
* `sports_queries.getTodayGames`
* `sports_queries.getHeadlinerGame`
* `sports_queries.getUniqueTeams`

### Notes / Payments

* `notes.*`
* `payments.*`

These existing functions mean the dashboard should be built as an **admin layer over the existing backend**, not as a parallel rewrite.

---

## Existing Convex Tables Already Available

* `categories`
* `notes`
* `orders`
* `payment_methods`
* `points_ledger`
* `products`
* `receipt_submissions`
* `reward_definitions`
* `upcoming_games`
* `user_profiles`

### Important takeaway

`points_ledger` already exists and should be treated as the **source of truth for loyalty activity/history** in the admin dashboard.

That is a major win. Do not re-invent the ledger unless the current implementation is broken.

---

## Authentication / Admin Access Decision

### Source of truth

Use **Clerk metadata** as the source of truth for admin authorization.

Recommended:

* `publicMetadata.role = "admin"`
* or `publicMetadata.roles = ["admin"]`

### Do not do this for V1

* do **not** build a DB-based “super admin” toggle as the primary source of truth
* do **not** rely only on frontend route protection

### Required implementation

* Next.js admin guard for route-level protection
* Convex server-side helper to enforce admin access on queries/mutations

Recommended helper:

* `lib/requireAdmin.ts`

This helper should check Clerk identity via Convex auth context and throw if the caller is not an admin.

### Initial admin assignment

For V1, manually seed initial admin access by Clerk user ID or email.

Later, if needed, build a protected admin-management UI that updates Clerk metadata through a secure backend path.

---

## High-Level Dashboard Structure

Recommended route structure for V1:

* `/admin`
* `/admin/menu`
* `/admin/loyalty`
* `/admin/orders`
* `/admin/sports`
* `/admin/settings`

Possible later additions:

* `/admin/customers`
* `/admin/integrations`
* `/admin/analytics`

### Why this route set

This is the leanest route structure that maps directly to the backend that already exists.

---

## Page-by-Page Build Plan

# 1) `/admin` — Overview

## Purpose

Operational snapshot. This page should answer:

* is the machine alive?
* are orders flowing?
* is loyalty working?
* is sports data synced?
* what needs attention right now?

## Backing data

* `orders`
* `user_profiles`
* `points_ledger`
* `receipt_submissions`
* `reward_definitions`
* `upcoming_games`

## Suggested cards

* Orders today
* Pending receipt reviews
* Active loyalty members
* Points issued today
* Rewards redeemed today
* Live/upcoming headliner games
* Sports sync health

## New admin queries needed

* `admin.getAdminStats`
* maybe `admin.getOverviewActivity`

---

# 2) `/admin/menu` — Menu Management

## Purpose

Control product availability and pricing for web/app experiences.

## Backing data

* `products`
* `categories`

## Use existing queries where possible

* `products.getAllProducts`
* `products.getCategories`

## UI features

* searchable product table/grid
* category filter
* stock toggle
* visibility toggle
* optional price editor

## Important policy decision

Be careful with price edits if POS becomes source of truth.

V1 recommendation:

* allow admin control of **web/app-facing availability**
* allow controlled price updates only if current flow supports it cleanly
* log all price changes

## New admin mutations/queries needed

* `admin_products.getAdminProducts`
* `admin_products.updateProductStock`
* `admin_products.updateProductVisibility`
* `admin_products.updateProductPrice`
* optional `admin_products.bulkUpdateProducts`

---

# 3) `/admin/loyalty` — Loyalty Control Center

## Purpose

This is the core admin tab and should feel self-service, not like internal cleanup tooling.

## Backing data

* `user_profiles`
* `points_ledger`
* `reward_definitions`
* `receipt_submissions`

## Existing functions already useful

* `loyalty.getUserProfile`
* `loyalty.getPointsHistory`
* `loyalty.getRewardDefinitions`
* `loyalty.submitReceipt`
* `loyalty.redeemReward`
* `loyalty.checkBirthdayReward`

## Loyalty page sections

### Top cards

* Active members
* Points issued
* Points redeemed
* Pending receipts
* Rewards redeemed this week

### Members section

* search by name / phone / email
* profile drawer
* current points balance
* lifetime points
* recent loyalty activity
* manual point adjustment

### Rewards section

* list reward definitions
* create reward
* edit reward
* archive / deactivate reward
* change points cost
* description / terms / image

### Receipts section

* pending receipt queue
* approve
* reject
* reason/note
* points preview

### Activity section

* recent ledger events
* redemptions
* manual adjustments
* receipt approvals

## Required new admin functions

### `admin_loyalty.ts`

* `searchLoyaltyMembers`
* `getMemberDetails`
* `getMemberPointsLedger`
* `adjustMemberPoints`
* `getPendingReceipts`
* `approveReceipt`
* `rejectReceipt`
* `createRewardDefinition`
* `updateRewardDefinition`
* `archiveRewardDefinition`
* `getRewardRedemptions`
* `getLoyaltyOverviewStats`

## Core rule

Treat `points_ledger` as the historical truth for loyalty activity.

Do not reduce loyalty to “receipt review + add points” only.

---

# 4) `/admin/orders` — Orders Operations

## Purpose

Real-time-ish operational panel for managers and staff.

## Backing data

* `orders`

## Existing functions

* `orders.getOrderHistory`

## UI features

* live order feed
* status
* amount
* customer
* timestamp
* source if available
* loyalty attached yes/no if available
* manual status handling

## Required new admin functions

### `admin_orders.ts`

* `getLiveOrders`
* `getOrdersByStatus`
* `getOrderDetails`
* `getOrderOverviewStats`
* optional `updateOrderStatus`
* optional `markOrderHandled`

If POS integration comes online later, this page can absorb sync/retry states.

---

# 5) `/admin/sports` — Sports / War Room

## Purpose

Operational control panel for the sports experience.

## Backing data

* `upcoming_games`

## Existing functions already available

* live/upcoming/date/team/headliner queries
* sports sync actions and mutations

## UI features

* today’s games
* highlighted games
* current headliner game
* sports sync health
* manual highlight override
* manual headliner override
* force sync

## Required new admin functions

### `admin_sports.ts`

* `getSportsAdminOverview`
* `runScheduledSyncNow`
* `clearStaleGamesNow`
* `overrideHeadlinerGame`
* `setManualGameHighlight`
* `clearGameHighlight`
* `getSportsSyncStatus`

This page is one of the easier wins because the sports backend is already relatively mature.

---

# 6) `/admin/settings` — Settings / Admin Info

## Purpose

Keep this narrow for V1.

## Suggested sections

* current admin identity
* admin access status
* environment/integration placeholders
* feature flags if any exist
* basic app settings surface

Later this can become:

* integration config
* staff management
* branding controls

---

## Recommended New Admin Modules

Create focused admin-only Convex modules instead of stuffing admin behavior into end-user functions.

Suggested modules:

* `admin.ts` or `admin_overview.ts`
* `admin_loyalty.ts`
* `admin_products.ts`
* `admin_orders.ts`
* `admin_sports.ts`
* `lib/requireAdmin.ts`

### Why

This keeps admin concerns clean and avoids mutating end-user flows with operator-only logic.

---

## What Not to Rebuild

Do **not**:

* rewrite loyalty from scratch
* rewrite orders from scratch
* create a second source of truth for roles in the DB
* invent a new loyalty schema if current tables are usable
* overbuild analytics before operations pages work
* deeply wire POS logic before sandbox access/token arrives

The dashboard should be a **clean admin skin over the machine that already exists**.

---

## Possible Future Integrations Page (Not V1-Critical)

Once Genesis/Xenial sandbox access lands, add an `/admin/integrations` page.

### Future sections

* Genesis/Xenial connection status
* sandbox/live badge
* token presence
* merchant/store/location mapping
* menu sync status
* last sync time
* test connection button
* sync errors

### Future POS abstraction

Plan toward a provider adapter pattern:

* `POSProviderAdapter`

  * `validateConnection()`
  * `fetchLocations()`
  * `fetchMenu()`
  * `fetchOrders(start, end)`
  * `syncOrder(orderPayload)`
  * `syncRefund(refundPayload)`
  * `applyRewardRedemption(redemptionPayload)`
  * `voidRewardRedemption(redemptionId)`

But do **not** block V1 admin delivery on full POS implementation.

---

## Optional Future Table

Only if needed later:

### `admin_actions`

Could log:

* admin user id
* action type
* target table
* target id
* before/after snapshots
* timestamp

Useful for:

* price changes
* stock toggles
* manual point adjustments
* receipt moderation

Do not block V1 on this unless you need strong auditability immediately.

---

## Testing / Verification Requirements

### Automated

* Non-admin user cannot access `/admin`
* Non-admin cannot call admin Convex queries/mutations
* Admin mutations throw if auth is missing or invalid

### Manual

* Admin can log in and see dashboard shell
* Admin can update menu stock and see it reflected in app/web
* Admin can search a loyalty member and inspect points history
* Admin can approve/reject a receipt submission
* Admin can edit/create a reward definition
* Admin can view orders feed
* Admin can override sports highlight/headliner state

---

## Implementation Priority

### Phase 1 (do this first)

1. `requireAdmin` helper
2. admin route guard
3. `/admin` overview shell
4. `/admin/loyalty`
5. `/admin/menu`

### Phase 2

6. `/admin/orders`
7. `/admin/sports`
8. settings polish

### Phase 3

9. analytics polish
10. integrations page
11. advanced permissions / staff management

---

## Final Build Guidance to the Coding Agent

Please revise the admin implementation plan to build the dashboard on top of the **existing Convex schema and functions**, not as a new parallel backend.

### Existing schema to use directly

* `user_profiles`
* `points_ledger`
* `reward_definitions`
* `receipt_submissions`
* `orders`
* `products`
* `categories`
* `upcoming_games`

### Priority admin surfaces

* Overview
* Menu
* Loyalty
* Orders
* Sports
* Settings

### Core implementation rules

* Use Clerk metadata as the source of truth for admin authorization
* Enforce admin access both in Next.js and Convex
* Treat `points_ledger` as the source of truth for loyalty activity/history
* Reuse existing read queries where possible
* Add focused admin-only Convex modules for missing operations
* Avoid unnecessary new tables/schema in V1

This should result in a lean, production-minded operator dashboard that is useful now and extensible later.
