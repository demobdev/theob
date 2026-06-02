# Android testing (Play Internal / “TestFlight for Android”)

**Fastest (no Play Console):** EAS **preview** → install APK from Expo build page.

**Play Internal testing (recommended for stakeholders):** production AAB → Google Play Console → Internal testing track.

## One-time setup

### 1. Log in to Expo/EAS

```powershell
cd c:\dev\theob\apps\native
npx eas login
```

Use the Expo account tied to project `the-owners-box` (`app.json` → `extra.eas.projectId`).

### 2. Set build env vars on EAS (not committed)

Cloud builds do **not** use your local `.env.local`. Add:

```powershell
eas secret:create --scope project --name EXPO_PUBLIC_CONVEX_URL --value "https://quiet-mole-11.convex.cloud" --type string
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_test_..." --type string
```

Use production Clerk/Convex URLs when you cut over.

**Genius integrator keys stay on Convex only** — never EAS secrets for those.

### 3. Google Play Console

1. [play.google.com/console](https://play.google.com/console) — sign in with your Android developer account.
2. Create app **The Owner's Box** (if missing), package name **`com.theownersbox.app`** (must match `app.json`).
3. Complete required store listing stubs (privacy policy URL, etc.) even for internal testing.
4. **Internal testing** → Create release → upload AAB (see below).

## Option A — Preview APK (quick smoke test)

```powershell
cd c:\dev\theob\apps\native
eas build -p android --profile preview
```

When finished, open the build URL → download **APK** → install on device (enable “Install unknown apps” if sideloading).

## Option B — Play Internal testing (store-like)

### Build AAB

```powershell
cd c:\dev\theob\apps\native
eas build -p android --profile production
```

`production` uses `distribution: store` and produces an **.aab** for Play.

### Upload to Play

**Manual (first time):**

1. Play Console → your app → **Testing** → **Internal testing**.
2. **Create new release** → upload the `.aab` from EAS (or download from Expo dashboard).
3. Add tester emails under **Testers** → copy the **opt-in link** and send to testers.

**CLI (after Play API access configured):**

```powershell
eas submit -p android --profile production --latest
```

Requires a Google Play service account JSON in EAS (see [Expo submit docs](https://docs.expo.dev/submit/android/)).

## iOS note

Same Expo project: `eas build -p ios --profile production` + TestFlight via App Store Connect. Android and iOS share `apps/native` env vars on EAS.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| App can’t reach backend | Check EAS secrets for `EXPO_PUBLIC_CONVEX_URL` |
| Auth fails on build | Clerk publishable key + `CLERK_ISSUER_URL` on **Convex** deployment |
| Package name mismatch | Play app id must be `com.theownersbox.app` |
