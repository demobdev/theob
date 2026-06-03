# Google Play listing assets (The OB)

Play Console icons are **separate** from the icon inside the `.aab`. The app list and Play Store page use **store listing** uploads.

## Privacy policy URL (Play Console → Set privacy policy)

Play requires a **public HTTPS** URL. After you deploy the web app:

```
https://YOUR-VERCEL-DOMAIN/privacy
```

Example: if Vercel hosts `theownersbox.com`, use `https://theownersbox.com/privacy`.

- **Source of truth:** `packages/legal` (shared with the mobile in-app screens)
- **Local preview:** `cd apps/web && npm run dev` → http://localhost:3000/privacy
- **Terms:** `https://YOUR-VERCEL-DOMAIN/terms`

Update `privacy@theownersbox.com` and phone in `packages/legal/src/index.ts` if your real contact info differs.

---

## App icon (fixes gray robot on Play dashboard)

1. Play Console → **The OB** → **Grow** → **Store presence** → **Main store listing** (or **Store settings** → **Main store listing**).
2. **App icon** → upload:

   `apps/native/assets/icon.png` (1024×1024 PNG)

   Google requires **512×512** minimum; this file qualifies.

3. **Save** → processing can take 15–60 minutes before the dashboard shows your icon.

The icon **on the phone** after install comes from `app.json` (`icon` + `android.adaptiveIcon`) in the AAB you already shipped.

## Internal testing opt-in link (gray “Copy link”)

You do **not** need Closed testing or Production.

1. **Internal testing** → **Testers** tab.
2. Check **MDB Team Testers** (or your list).
3. Click **Save** at the bottom of the page (required).
4. After release is **Available to internal testers**, refresh — **Copy link** under “Join on the web” should activate.

If it still says “when you publish your app”:

- Confirm **Releases** shows green **Available to internal testers**.
- Finish **Dashboard** setup tasks (privacy policy, app access, etc.).
- Add **App icon** on main store listing (above) — some accounts unlock the link only after minimal listing exists.

Send testers the copied link; Google often sends **no email** for internal testing.

## Tester emails

List must include the **exact Gmail** each person uses on their Android Play Store account.

Current list (example): `christian@blockbusters.tech`, `demo@blockbusters.tech`, `morgan@blockbusters.tech` — add `denny@...` if needed, then **Save**.
