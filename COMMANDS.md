# The Owner's Box (OB / THEOB) — Commands Reference

Essential commands for the OB monorepo (`apps/native`, `apps/web`, `convex/`).

## Quick start (recommended)

From the **repo root** (`c:\dev\theob` or your clone path):

1. **Install**
   ```bash
   npm install
   ```
2. **Environment** — copy examples and fill in keys (or use local Convex below):
   - `apps/native/.env.local` from `apps/native/.example.env`
   - `apps/web/.env.local` from `apps/web/.example.env`
   - Root `.env.local` is created by `npx convex dev` (Convex URL for the deployment)
3. **Backend (Convex)** — terminal 1:
   ```bash
   npm run dev:backend
   ```
   First-time / CI without login: `CONVEX_AGENT_MODE=anonymous npx convex dev` (local URL `http://127.0.0.1:3210`).
4. **Seed demo menu & rewards** (once per fresh deployment):
   ```bash
   npx convex run seedMenu:populate
   npx convex run seedRewards:seedRewards
   ```
5. **After linking a cloud Convex project** (`quiet-mole-11`, etc.): run `npx convex dev`, answer **Y** to link, then:
   ```bash
   npm run sync:env
   ```
   This copies `CONVEX_URL` from root `.env.local` into native and web app env files. Restart Expo if it was running.

6. **Mobile (Android emulator)** — terminal 2:
   ```bash
   npm run android
   ```
   Or: `npm run dev:native` then press **`a`** in the Expo CLI.
7. **Web (optional)** — terminal 3:
   ```bash
   npm run dev:web
   ```

> `npm run dev` starts **Next.js only** (`web-app`). It does **not** start Expo or Convex.

---

## Mobile (Expo)

| Command | Purpose |
|---------|---------|
| `npm run dev:native` | `expo start` |
| `npm run android` | `expo start --android` |
| `npm run ios` | `expo start --ios` |
| `npm run android --workspace=native -- --clear` | Clear Metro cache |

**Package ID:** `com.theownersbox.app` (`apps/native/app.json`).

### Android on Windows

1. Install [Android Studio](https://developer.android.com/studio) with SDK Platform 34+ and create an AVD.
2. Set user env vars (System → Environment Variables):
   - `ANDROID_HOME` = e.g. `%LOCALAPPDATA%\Android\Sdk`
   - Add to `Path`: `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\emulator`
3. Start the emulator from Android Studio (Device Manager), then run `npm run android`.
4. If the emulator hangs on the boot logo, cold-boot the AVD or create a new device with API 34.
5. **Expo Go version mismatch:** When Expo asks to install the recommended Expo Go, answer **Y** in the terminal, or update **Expo Go** from the Play Store inside the emulator (SDK 54 needs Expo Go 54.0.8+).
6. **Manual launch (if `--android` prompts fail):** Run `npm run dev:native`, then in the emulator open **Expo Go** and connect to the URL shown in the terminal (e.g. `exp://YOUR_LAN_IP:8081`).

### iOS (macOS only)

`npm run ios --workspace=native -- --clear` or `cd apps/native && npx expo start --ios --clear`

---

## Backend (Convex)

- **Source:** `/convex` (canonical; not `packages/backend/convex`)
- **Config:** `/convex.json`
- **Auth:** set `CLERK_ISSUER_URL` on the deployment (e.g. `https://<your-clerk-subdomain>.clerk.accounts.dev`)

```bash
npm run dev:backend          # watcher + deploy on save
npx convex run seedMenu:populate
npx convex run seedMenuExtras:addCokeDrinks   # incremental Coke drinks (no full re-seed)
npx convex run seedRewards:seedRewards
```

---

## Android builds (beyond Expo Go)

| Goal | Command |
|------|---------|
| Daily dev | Expo Go + `npm run dev:native` / `npm run android` |
| Internal APK | `cd apps/native && eas build -p android --profile preview` |
| Dev client | Add `expo-dev-client`, then `eas build --profile development` |
| Play Store | `eas build --profile production` (see `PRODUCTION_READY.md`) |

`eas.json` **preview** profile builds an APK for internal testing.

---

## Project structure

- `/apps/native` — Expo (React Native) OB app
- `/apps/web` — Next.js web app
- `/convex` — Convex backend
- `/packages` — shared packages (`@packages/backend` is legacy; use root `/convex`)

## Environment troubleshooting

- **Missing Convex URL in app:** ensure `EXPO_PUBLIC_CONVEX_URL` / `NEXT_PUBLIC_CONVEX_URL` match `CONVEX_URL` in root `.env.local`.
- **Clerk login fails:** verify `CLERK_ISSUER_URL` in Convex dashboard and Clerk JWT template named `convex`.
- **Low disk:** keep 10GB+ free for stable emulator performance.
