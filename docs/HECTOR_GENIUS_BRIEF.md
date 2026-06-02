# What to get from Hector + Genius / Xenial

Use this as a copy-paste for Hector or as your script on the vendor call.

---

## Message you can send Hector

> We’re building **The Owner’s Box** mobile app for **Greenville** (one store: 1757 Woodruff Rd). The app will send **in-store pickup** and **curbside pickup** orders into **Genius / Xenial** — not native delivery (that stays on DoorDash/Uber/Grubhub).
>
> The app backend is ready to receive POS credentials. We need you (or an intro to your **Genius/Xenial rep**) for:
>
> 1. **Integrator / API access** — sandbox first, production before opening  
> 2. **Greenville site / store ID** in Xenial (`GENIUS_SITE_ID`)  
> 3. **API base URL** (sandbox vs prod — we have `xooapi.xenial.com` noted from prior discussions)  
> 4. **How pickup vs curbside** shows on the kitchen ticket / KDS  
> 5. **Order status** — webhook or poll when order is **ready on rack** (not just a fixed 20–30 min timer)  
> 6. **Menu** — when items will be in POS, and whether we get **product/SKU IDs** for app ↔ POS mapping  
> 7. **Payments** — path for **card tokenization** into Genius vault (we do not store PANs)  
> 8. **Timeline** — sandbox date, go-live date, who owns menu build in Genius  
>
> Can you intro us to the right **Heartland/Xenial integration** contact, or send the integrator onboarding link and sandbox credentials?

---

## Credentials we will plug in (Convex only — not the phone app)

| What | Env name | Who provides |
|------|-----------|--------------|
| API host | `GENIUS_API_BASE_URL` | Xenial integrator docs |
| Integrator token | `GENIUS_INTEGRATOR_TOKEN` | Hector / Xenial onboarding |
| Greenville store | `GENIUS_SITE_ID` | Xenial after site is created |
| Webhook signing secret | `GENIUS_WEBHOOK_SECRET` | Xenial when webhooks enabled |

```powershell
npx convex env set GENIUS_API_BASE_URL "..."
npx convex env set GENIUS_INTEGRATOR_TOKEN "..."
npx convex env set GENIUS_SITE_ID "..."
npx convex env set GENIUS_WEBHOOK_SECRET "..."
```

---

## How you usually reach a “Genius representative”

There is **no public “call Genius API”** line in our repo. In practice the path is:

1. **Hector first** — he’s already tied to your POS deal / integrator tokens (per project notes). Ask him: *“Who is our Xenial implementation rep and integration contact?”*
2. **Who sold you the POS** — dealer or Heartland sales rep who signed the restaurant; they open a **implementation / integration** ticket.
3. **Heartland Restaurant / Xenial (Global Payments)** — partner or developer onboarding for **online ordering / OAPI** (names vary by contract). Hector or the dealer requests **integrator credentials** and **sandbox**.
4. **Your OB app** — we are the **custom ordering app** (integrator), not replacing Genius at the register; Genius remains kitchen + payments source of truth.

If Hector says “Genius handles that,” clarify: you need the **technical integration** team (API + site ID + webhooks), not only hardware install.

---

## What will happen on a typical vendor conversation

| Phase | What they do | What you need from the call |
|--------|----------------|------------------------------|
| **Discovery** | Confirm one site (Greenville), pickup + curbside, no in-app delivery | Written yes/no on each order type |
| **Sandbox** | Create test site, maybe test menu | `GENIUS_SITE_ID`, sandbox URL + token |
| **Menu** | Build categories/items in Genius or import | Item IDs, modifiers, out-of-stock behavior |
| **Order inject** | Show API or middleware for “mobile order → KDS” | Exact endpoint, required fields, curbside + vehicle |
| **Status** | Explain fired / preparing / ready / picked up | Webhook URL we host on Convex, or polling |
| **Payments** | Vault / tokenization for app checkout | SDK or server-side token API before go-live |
| **Go-live** | Flip prod credentials, training | Prod `GENIUS_*` env on Convex, opening checklist |

---

## Questions to ask on the call (short list)

**Access**

- Do we get an **integrator token** or per-store API keys?
- Sandbox URL and how long sandbox stays available?

**Orders**

- Which API creates a **pickup** vs **curbside** order?
- Required fields: phone, name, promised time, **vehicle** (make/model/color)?
- Do orders print on the same KDS as in-store, or a separate bump screen?

**Timing**

- Can the app send **requested ready time**, or only ASAP?
- When staff marks **ready / on rack**, does the API fire an event we can use for a push notification?

**Menu**

- When will Greenville menu be loaded in Genius?
- Do we sync menu via API or export, and what is the **product ID** field?

**Payments**

- How does the app pass a **payment token** (not raw card) with the order?
- Is payment captured at order time or at pickup?

**Support**

- Who is our contact after opening (email / ticket portal)?
- SLA if orders fail to inject during service?

---

## What you can tell them about our app (30 seconds)

- **Brand:** The Owner’s Box (`com.theownersbox.app`)  
- **Location:** One store — Greenville, SC (for now)  
- **Fulfillment:** In-store pickup + curbside; delivery via third-party apps only  
- **Backend:** Convex (cloud); POS submit is **server-side** after customer places order  
- **Today:** Demo menu in our database until Genius menu exists; POS sync is wired but waiting on credentials  

---

## Not blocking opening week (can wait on Hector)

- Webhook “order ready” push (nice for curbside; timer fallback OK short-term)  
- Live payment capture (can stage with pay-at-pickup if vendor requires)  
- Full menu sync automation (manual Convex menu OK for soft open)

## Blocking real POS orders

- `GENIUS_INTEGRATOR_TOKEN` + `GENIUS_SITE_ID` + confirmed order API  
- Menu items in Genius with stable IDs (or manual mapping table)
