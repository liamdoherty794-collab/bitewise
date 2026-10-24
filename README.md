# Bitewise

A free food scanner. Point it at a barcode or a plate, then see whether that food fits the day you set. No account.

This build is a web app you open in the phone browser. It is not an Expo Go project, so Expo Go cannot load it.

## What it does

- Barcode lookup through the free Open Food Facts API, with a 0–100 score (Nutri-Score, NOVA, additives), plain-language problem ingredients, and up to three better options in the same aisle.
- Meal photos through the Gemini API. You can edit the name, portion, and macros before saving. Free plan: 3 successful photo reads a day. Barcodes and typed meals are unlimited.
- Diary with a calorie ring, macro bars, and a weekly chart. Age, height, weight, and goal set the targets. Data stays in this browser.

## Run it

```bash
npm install
cp .env.example .env   # then add your Gemini key
npm run dev
```

Open the printed URL on your computer. On a phone, use the same Wi-Fi and open `http://<your-computer-ip>:8080`. In Safari or Chrome, use Add to Home Screen. The icon is the Bitewise mark.

## Keys

Create `.env` in this folder:

```
GEMINI_API_KEY=your-google-ai-studio-key
```

Get a free key from Google AI Studio. Meal photos call `gemini-2.5-flash`, then `gemini-2.0-flash`. Without the key, you can still scan barcodes and type a meal by hand.

Open Food Facts does not need a key.

## Where the code lives

```
src/components/nara/   screens, scanner, logo, onboarding
src/lib/nara/          scoring, Open Food Facts, Gemini, diary store
src/lib/nara/plan.ts   free vs pro photo cap (pro is not sold yet)
public/favicon.svg     the same mark as the header
```

## Later

`currentPlan()` in `src/lib/nara/plan.ts` returns `free` unless `localStorage` has `bitewise-plan=pro`. A future upgrade only needs to set that after a purchase. The free app already includes scanning, the diary, and three meal photos a day.
