# Observability before Android / iOS store builds

Use this checklist **before** uploading your AAB to Play Internal testing (or TestFlight).

## Stack overview

| Tool | Role | Where keys live |
|------|------|-----------------|
| **Sentry** | Crashes, stack traces, performance traces | App env + EAS secrets (native); Vercel/env (web) |
| **PostHog** | Product analytics, funnels, session replay (web), `order_placed` | App env + EAS secrets |

Both are **optional at dev time** (no DSN/key = disabled, app still runs).

---

## 1. Sentry (required for production debugging)

### Create projects

In [sentry.io](https://sentry.io):

1. **ob** (React Native) @ org **wvfm-labs** — for Expo Android/iOS builds  
2. **ownersbox-web** or **javascript-nextjs** (Next.js) — for admin/marketing site (optional)  

Copy each project’s **DSN** (`https://...@....ingest.sentry.io/...`).

### Local env

**`apps/native/.env.local`**
```bash
EXPO_PUBLIC_SENTRY_DSN=https://....@....ingest.sentry.io/....
```

**`apps/web/.env.local`**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://....@....ingest.sentry.io/....
SENTRY_DSN=https://....@....ingest.sentry.io/....
```

### EAS (Android AAB / iOS) — required for readable stack traces

Add [EAS secrets](https://docs.expo.dev/build-reference/variables/):

```powershell
cd c:\dev\theob\apps\native
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://..." --type string
npx eas-cli secret:create --scope project --name SENTRY_AUTH_TOKEN --value "sntrys_..." --type string
npx eas-cli secret:create --scope project --name SENTRY_ORG --value "your-org-slug" --type string
npx eas-cli secret:create --scope project --name SENTRY_PROJECT --value "ob" --type string
```

`SENTRY_AUTH_TOKEN` is a [Sentry user auth token](https://sentry.io/settings/account/api/auth-tokens/) with `project:releases` and `org:read`. The `@sentry/react-native/expo` plugin uploads source maps during **production** EAS builds when this token is set.

### Smoke test

- Native: throw a test error in dev with DSN set → issue appears in Sentry within ~1 min.  
- Web: trigger an error in admin → same.

Handled errors (e.g. checkout) call `reportError()` → Sentry + PostHog.

---

## 2. PostHog (product analytics)

See [`POSTHOG_SETUP.md`](POSTHOG_SETUP.md).

```powershell
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_POSTHOG_KEY --value "phc_..." --type string
```

Web already uses `capture_exceptions: true` in `instrumentation-client.ts`.

---

## 3. Build order (AAB)

```powershell
cd c:\dev\theob\apps\native

# Confirm secrets
npx eas-cli secret:list --scope project

# Production AAB for Play
npx eas-cli build -p android --profile production
```

Then Play Console → Internal testing → upload `.aab`.

---

## 4. What you’ll see in production

| Event | Sentry | PostHog |
|-------|--------|---------|
| App crash | Issue + stack (with source maps) | — |
| `placeOrder` failure | `reportError` + stack | `$exception` |
| Screen navigation | — | `$screen` |
| Order completed | — | `order_placed` |
| Signed-in user | User context on crash | `identify` (Clerk id) |

---

## 5. Not in scope yet (OK for first internal build)

- Convex server-side Sentry (actions/mutations)  
- Genius POS webhook alerting  
- PagerDuty / Slack alerts (configure in Sentry → Alerts after first issues flow)

---

## Quick “ready for AAB?” checklist

- [ ] `EXPO_PUBLIC_SENTRY_DSN` in EAS secrets  
- [ ] `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` in EAS secrets (source maps)  
- [ ] `EXPO_PUBLIC_CONVEX_URL` + `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in EAS secrets  
- [ ] `EXPO_PUBLIC_POSTHOG_KEY` in EAS secrets (optional but recommended)  
- [ ] Play app package = `com.theownersbox.app`  
- [ ] One successful `eas build -p android --profile production`
