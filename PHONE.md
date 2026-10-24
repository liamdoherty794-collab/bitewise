# Put Bitewise on your home screen from a phone

Bitewise is already a website that installs like an app. Your diary stays in the phone. Meal photos go to a server route. The Gemini key stays in Vercel, not in the site.

You need a free GitHub account and a free Vercel account. Do this in the phone's browser. On iPhone, if a button is missing, tap the **Aa** menu and choose **Request Desktop Website**.

## 1. Download the project

Download `bitewise-pwa.zip` from the chat. It lands in the Files app. Leave it zipped.

## 2. Create the GitHub repo

1. Open [github.com/new](https://github.com/new) and sign in.
2. Repository name: `bitewise`.
3. Public is fine. Do not add a README, a gitignore, or a license. The zip already has the files.
4. Tap **Create repository**.

## 3. Upload the zip with Codespaces

Codespaces is a free editor that runs in the browser, so you never need a computer.

1. On the empty repo, tap **Code**, then **Codespaces**, then **Create codespace on main**.
2. Wait until the editor finishes loading.
3. In the left file list, open the **...** menu and tap **Upload...**. Choose `bitewise-pwa.zip`.
4. Open the terminal with the panel at the bottom, or **Ctrl+`** if a keyboard is attached. Type these lines one at a time:

```bash
unzip -o bitewise-pwa.zip
rm bitewise-pwa.zip
git add -A
git commit -m "Add Bitewise"
git push
```

5. If `git commit` says you need an identity, run these two lines with your own name and GitHub email, then commit again:

```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

## 4. Deploy on Vercel

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import the `bitewise` repository.
3. Leave the build command as `npm run build`. Do not set an output directory.
4. Open **Environment Variables**. Add each of these. None of the secret names start with `VITE_`.

   - `GEMINI_API_KEY` — the paid key
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — from a free Redis database at [console.upstash.com](https://console.upstash.com/)
   - `GEMINI_DAILY_CAP` — for example `200` (all installs, per UTC day)
   - `PHOTO_IP_DAILY_LIMIT` — for example `30` (one network, per UTC day)
   - `RATE_LIMIT_SALT` — any long random string

   Without the Upstash pair, meal photos on the live site are refused. The key would otherwise be callable with no ceiling.
5. Tap **Deploy** and wait until it says Ready.
6. Copy the `https://something.vercel.app` address.

## 5. Install it

**iPhone:** open that address in Safari. Tap Share, then **Add to Home Screen**, then Add.

**Android:** open it in Chrome. Tap the menu, then **Install app** or **Add to Home screen**.

The icon opens Bitewise full screen. Barcode scans use the camera. iPhone Safari does not reliably include a barcode detector, so Bitewise falls back to ZXing on the same camera stream. The diary stays in the phone. A meal photo is sent to the server. After 3 photos on that phone, or when the network or global cap is hit, photos wait until tomorrow. Removing the icon does not delete the diary. Clearing the browser's data for the site does. Profile has **Export diary**.
