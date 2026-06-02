# Genius / Xenial POS integration

**Genius** (restaurant-facing name) = **Xenial** APIs in this codebase (`xooapi.xenial.com`).

## Files

| File | Purpose |
|------|------|
| [`types.ts`](types.ts) | Payload/response shapes (draft until vendor spec) |
| [`mapOrder.ts`](mapOrder.ts) | Convex `orders` doc → Genius create-order body |
| [`submitOrder.ts`](submitOrder.ts) | `internalAction` — HTTP to Genius (stub until creds) |

## Flow

1. Client calls `orders.placeOrder` mutation (auth required).
2. Mutation inserts `orders` row with `status: pending`, `paymentStatus: pending`.
3. Mutation schedules `internal.integrations.genius.submitOrder.submitToPos` with `{ orderId }`.
4. Action reads order + menu mapping, POSTs to Genius, patches `posOrderId` / `posStatus`.
5. Genius webhook (future) or poll updates `status` → `ready` → push to customer.

## Greenville

Always send `locationId: greenville_01` and site id from env `GENIUS_SITE_ID`.

## Credentials (Convex env only)

```
GENIUS_API_BASE_URL=
GENIUS_INTEGRATOR_TOKEN=
GENIUS_SITE_ID=
GENIUS_WEBHOOK_SECRET=
```

Get integrator access from Hector / Heartland-Xenial partner onboarding.

## Pickup types mapping (draft)

| App `fulfillmentMethod` | Genius `destination` (today string) | Notes |
|------------------------|-------------------------------------|--------|
| `pickup_instore` | In-Store Pickup | Counter / expo rack |
| `pickup_curbside` | Curbside Pickup | Include `carDetails` + phone |
| `delivery_partner` | Do not send to Genius | Partner apps only |

## Status mapping (draft — confirm with API)

| Genius / KDS | Convex `orders.status` | Customer message |
|--------------|------------------------|------------------|
| received / sent | `pending` | Order received |
| in kitchen | `preparing` | Kitchen is working on it |
| ready / on rack | `ready` | Ready for pickup |
| picked up / closed | `completed` | Enjoy |

## Testing without production POS

Until credentials exist, `submitToPos` logs payload and sets `posSyncError` on the order for admin visibility.
