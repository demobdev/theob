# 🛠 The Owner's Box - Commands Reference

This file tracks the essential commands and locations for the "The Owner's Box" monorepo development.

## 🚀 Quick Start
Run these from the **root** directory (`/Users/demobailey/theob`):

1. **Backend (Convex)**
   ```bash
   npx convex dev
   ```
2. **Frontend (Turbo / Expo / Next.js)**
   ```bash
   npm run dev
   ```

---

## 📱 Mobile Development (Native)
Run from root or `cd apps/native`:

- **iOS Simulator**: `npm run ios --workspace=native -- --clear`
- **Android Emulator**: `npm run android --workspace=native -- --clear`

> [!TIP]
> **Reliable iOS Launch (Direct)**: If the workspace script hangs, run this from the root:
> `cd apps/native && npx expo start --ios --clear`
> Then press **`i`** and select the **iPhone 16 Pro** from the list.

> [!TIP]
> If the Android emulator hangs on the Google logo, try:
> `~/Library/Android/sdk/emulator/emulator -avd Medium_Phone_API_36.1 -gpu swiftshader -no-snapshot-load`

## 🗄 Backend (Convex)
- **Source**: `/convex` (Moved from `packages/backend/convex` for alignment)
- **Schema**: `/convex/schema.ts`
- **Queries**: `/convex/sports_queries.ts`, `/convex/products.ts`, `/convex/loyalty.ts`

---

## 🏗 Project Structure
- `/apps/native`: Expo (React Native) app
- `/apps/web`: Next.js web application
- `/convex`: The shared Backend-as-a-Service (Convex)
- `/packages`: Shared components and utilities

## 💡 Environment Troubleshooting
- **Low Disk**: We currently have **41GB free**. Avoid letting it drop below 10GB for stable emulator performance.
- **Paths**: Android SDK paths are configured in your `~/.zshrc`.
