# OB Android development

## Daily dev (default)

Use **Expo Go** with the managed workflow — no `android/` folder required.

```bash
# From repo root (Convex must be running: npm run dev:backend)
npm run android
```

## When you need a standalone APK

```bash
cd apps/native
eas build -p android --profile preview
```

Install the APK on a device or emulator for internal testing.

## When you need a dev client

The EAS `development` profile expects `expo-dev-client`. Install it and rebuild:

```bash
cd apps/native
npx expo install expo-dev-client
eas build -p android --profile development
```

## Play Store

Use `eas build -p android --profile production` after addressing items in `PRODUCTION_READY.md`.
