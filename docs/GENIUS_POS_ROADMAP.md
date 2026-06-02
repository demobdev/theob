# Genius POS (Xenial) + Greenville pickup — implementation roadmap

## What “Genius” is in this project

The codebase refers to **GeniuS / Xenial** — the restaurant POS platform (API host noted in code: `xooapi.xenial.com`). That is the system Hector mentioned for **integrator tokens**. Staff may say “Genius”; treat it as the same integration target until you confirm product SKU with the vendor.

**Reference:** Admin UI placeholder — “Genesis/Xenial POS Sandbox” in [`apps/web/src/app/admin/settings/page.tsx`](../apps/web/src/app/admin/settings/page.tsx).

## What is already wired (UI + data model)

| Piece | Status |
|-------|--------|
| Fulfillment types | `pickup_instore`, `pickup_curbside`, `delivery_partner` in [`OrderContext`](../apps/native/src/context/OrderContext.tsx) |
| Greenville address in modal | Hardcoded in [`PreferencesModal`](../apps/native/src/components/PreferencesModal.tsx) |
| Curbside vehicle | Make/model/color → Convex `loyalty.updateUserVehicle` + order `carDetails` |
| Phone, schedule slots | PreferencesModal + `scheduledTime` on order |
| Order schema | `destination`, `location`, `pickupTime`, `carDetails`, `status`, `paymentStatus` |
| Payment tokens | Schema + `payments.ts` — **client still uses `mockTokenize`** |
| POS inject point | [`convex/orders.ts`](../convex/orders.ts) — **mock `console.log` only** |
| Admin order board | [`admin_orders.getLiveOrders`](../convex/admin_orders.ts) — manual status patch only |

## What is NOT wired yet

- Real Xenial/Genius API credentials (`integrator` token from Hector)
- HTTP submit to POS after `placeOrder`
- Webhooks from POS → update `orders.status` (`preparing` → `ready` → `completed`)
- Payment capture through Genius vault (only mock card save)
- Push notification when order hits “on rack” / ready
- Merged in-store + curbside ticket types on KDS (restaurant config + API payload)

## Kitchen timing: 20–30 minutes vs Genius “ready”

**Two valid models (can combine):**

### A. Promise time (app-side, no POS)

- On **ASAP**, show window **now + 20–30 min** (updated in `PreferencesModal`).
- On **scheduled**, earliest slot = now + 30 min (kitchen buffer).
- Store `estimatedReadyAt` ISO on order when placing.

### B. Truth from Genius (POS-side)

- POS/KDS marks order **in progress** → **ready** (expo on rack, bump bar, etc.).
- Genius sends webhook or we poll order status API.
- App updates UI + push: “Your order is ready for pickup.”

**Recommendation:** Ship **A** immediately for customer expectations; implement **B** so staff don’t rely on fixed timers when the kitchen is slammed or quiet.

Ask Hector / Genius rep:

1. Which API creates **mobile/online** orders for pickup vs curbside?
2. Is there a **webhook** for status changes (fired, ready, picked up)?
3. How are **curbside** orders identified on the ticket (flag, destination type)?
4. Sandbox URL + test site ID for Greenville?

## Convex env vars (Genius — when integrated)

Set in Convex dashboard (names TBD with vendor docs):

| Key | Purpose |
|-----|---------|
| `GENIUS_API_BASE_URL` | e.g. `https://xooapi.xenial.com` or sandbox |
| `GENIUS_INTEGRATOR_TOKEN` | Server-side only |
| `GENIUS_SITE_ID` | Greenville store in Xenial |
| `GENIUS_WEBHOOK_SECRET` | Verify incoming status webhooks |

Do **not** put integrator tokens in mobile `.env.local`.

## Implementation phases

### Phase 1 — Cart & fulfillment production polish (no Genius credentials)

- [x] Canonical Greenville location constant
- [ ] Checkout validation: auth, kitchen hours, phone, curbside vehicle
- [ ] 20–30 min ASAP window + schedule buffer
- [ ] Block or redirect `delivery_partner` to partner links (no fake native delivery checkout)
- [ ] Persist `fulfillmentMethod` + `estimatedReadyAt` on order document

### Phase 2 — Genius API scaffold (credentials from Hector)

- [ ] `convex/integrations/genius/` client + payload mapper
- [ ] `internalAction` `submitOrderToPos` scheduled from `placeOrder`
- [ ] Store `posOrderId`, `posStatus` on order
- [ ] Admin shows POS id + last sync error

### Phase 3 — Payments

- [ ] Replace `mockTokenize` with Genius/Xenial JS SDK or server-side tokenization
- [ ] `placeOrder` requires `paymentMethodId` + `paymentStatus: paid` before POS submit

### Phase 4 — Status loop

- [ ] Webhook HTTP action `genius/webhook` OR cron poll
- [ ] Map POS statuses → `preparing` | `ready` | `completed` | `cancelled`
- [ ] Expo push on `ready` for curbside/in-store

### Phase 5 — Operational

- [ ] Web admin: live KDS-style board (already partial)
- [ ] Store hours + holiday overrides in Convex (not just client `isKitchenOpen`)

## External references

- Public ESPN-style patterns are unrelated; POS docs come from **Xenial/Heartland integrator portal** (get from Hector).
- Community ESPN API doc in repo: [`convex/sports/ESPN_MIGRATION.md`](../convex/sports/ESPN_MIGRATION.md) — separate workstream.
