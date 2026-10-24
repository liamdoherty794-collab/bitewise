# Bitewise privacy policy

**Who:** [Your legal name]
**Contact:** [you@example.com]
**Last updated:** 24 October 2026

Bitewise is a food scanner you open in the browser or from your home screen. It has no account, no ads, and no analytics. It does not sell data.

## Stays on your phone

Your age, sex, height, weight, goal, calorie targets, diary, recent scans, and the count of meal photos used today stay in this site's storage in the browser. They are not uploaded. Export diary downloads a copy you choose to keep. Erasing the diary in Profile, or clearing this site's browser data, deletes them. Removing the home-screen icon alone does not.

## Meal photos

A meal photo is a JPEG sent to Bitewise's server so it can be estimated. The request does not include your name, diary, or targets. The server does not write the photo into a Bitewise database.

Before the photo is read, the server counts it against two limits stored in Upstash: one for your network, and one for everyone using Bitewise that UTC day. It hashes your IP address with a secret salt and stores the hash as a counter for up to 48 hours. It does not store the raw IP, and it does not turn the address into a location.

A photo that passes those limits is sent to Google's paid Gemini API with a short instruction to estimate the foods. Google processes it only to return that estimate. With billing enabled on this key, Google does not use the photo or the estimate to improve its products.

The app also stops you after 3 meal photos on that phone per day. That count stays on the phone.

## Request logs

The site is hosted on Vercel. Like most hosts, Vercel automatically keeps request logs for security and operations. A log line can include the IP address, the time, the URL (such as the meal-photo path), the status code, and the browser type. Bitewise does not use those logs as a diary or a profile. How long Vercel keeps them is covered by Vercel's own policy, not by this app.

## Barcodes

Looking up a barcode sends the code from your phone to Open Food Facts. That request does not include the diary.

## Children

Bitewise is not directed at children under 13, and we do not knowingly collect their information.

## Changes

If this policy changes, the date at the top changes with it.
