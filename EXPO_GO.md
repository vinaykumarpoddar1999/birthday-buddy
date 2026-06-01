# Expo Go (SDK 54)

This project targets **Expo SDK 54**, which matches the Expo Go app from the **App Store / Play Store**.

## Start the app

```bash
npm install
npm run start:clear
```

Scan the QR code with Expo Go on your phone (same Wi‑Fi as your PC).

## If you see "incompatible with Expo Go"

- Update Expo Go from the store, or
- Confirm `package.json` has `"expo": "~54.0.0"` and run `npx expo install --fix`

## Development build (optional)

Only needed if you add custom native code not included in Expo Go. This app is designed to run in **Expo Go** for daily development.

```bash
npx expo install expo-dev-client
npx expo prebuild
npx expo run:android
```
