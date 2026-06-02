# PostHog setup — The Owner's Box

## Get your project API key

1. [PostHog](https://us.posthog.com) → your project → **Settings** → **Project API key** (`phc_...`).
2. US cloud host: `https://us.i.posthog.com` (EU: `https://eu.i.posthog.com`).

## Local env

**Mobile** (`apps/native/.env.local`):

```bash
EXPO_PUBLIC_POSTHOG_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**Web** (`apps/web/.env.local`):

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Restart dev servers after adding keys. If the key is missing, analytics stays **off** (no crashes).

## EAS / Play builds

Add the same `EXPO_PUBLIC_POSTHOG_*` vars as [EAS secrets](https://docs.expo.dev/build-reference/variables/) for Android/iOS cloud builds.

## What is wired

| Surface | Behavior |
|---------|----------|
| Native app | Screen views (React Navigation), touch autocapture, Clerk `identify`, `order_placed` on checkout |
| Web | `instrumentation-client.ts`, `/ingest` proxy, Clerk identify, exception capture |

Genius/POS keys remain **Convex-only** — not PostHog.
