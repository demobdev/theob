# The Owner's Box — Menu PDF Creative Brief

Hand this document to your creative agent. Source file: **`The owners box menu.pdf`** (repo root) and extracted text in **`apps/web/public/menu_text.txt`**.

## Deliverable

- **One print-ready PDF** named `menu.pdf`
- **Drop-in path:** `apps/web/public/menu.pdf` (replaces current file; site embeds and download links use this path)
- **Format:** US Letter or tabloid (designer choice), optimized for **web viewing** (readable at 100% zoom on mobile) and **download/print**

---

## Brand (match the website)

| Element | Spec |
|--------|------|
| Primary background | Near-black `#0A0A0A` or dark leather texture |
| Accent | Gold `#D4AF37` — rules, category headers, highlights |
| Typography | Bold, uppercase headlines (Montserrat or similar); clean body for descriptions |
| Voice | Sports bar + scratch kitchen — confident, game-day energy, not fine-dining stiff |
| Logo | Use assets in `apps/web/public/` — `theob-gold.JPG`, `theob-white.JPG`, or OB shield from site |
| Location | **1757 Woodruff Rd, STE A, Greenville, SC 29607** |
| Web | **theownersbox.com** (fix old PDF typo `ownerbox.com`) |

---

## Layout direction

1. **Cover / hero panel** — “The Owner’s Box Bar & Grill”, Greenville SC, optional tagline (e.g. “Craft Pizza, Wings & Game Day Energy”).
2. **Category sections** — clear hierarchy, gold section titles, consistent price column alignment.
3. **Wings callout** — sauce list and (6)/(12)/(18) pricing grid; keep “Jumbo Wings” prominent.
4. **Brunch block** — separate section: **Sat & Sun · 9AM – 2PM**.
5. **Footer** — food safety disclaimer (raw/undercooked notice from old menu), social **@ownersbox.gvl** (Instagram/TikTok), website, phone when confirmed.
6. **No POS vendor branding** — do not mention Heartland, Genius, Xenial, etc.

---

## Menu content to include (from legacy PDF — verify prices with client)

### Appetizers
- Crab Dip — lump crabmeat, cream sauce, grilled pita chips
- Crispy Fried Shrimp — tartar & sweet & sour sauce
- Queso & Chorizo — Mexican-style cheese dip, fried corn chips
- Spicy Bang-Bang Shrimp
- Crispy Calamari — fried onions, peppers, tartar sauce
- Loaded Short Rib Nachos — shredded ribs, cheese, jalapeño, tomatoes

### Salads
- Classic Caesar — add-ons: chicken +6, shrimp +8, salmon +10, steak +12
- Chopped House Salad — bacon, tomatoes, cucumber, blue cheese, iceberg
- Fried Goat Cheese & Arugula — goat cheese balls, balsamic, pecans, ranch

### Sandwiches *(served with fries or side salad)*
- Chicago — mustard, onions, relish, pickle, tomatoes, sport peppers
- The Bar Chicken — grilled or crispy, buffalo, ranch, smoked bacon
- Crab Cake — lump crab, arugula, tomatoes, tartar, toasted bun
- Classic Philly — shaved prime rib or grilled chicken, peppers, onion, cheese sauce

### Wings
- Jumbo Wings — grilled or crispy; celery & carrots; ranch or blue cheese
- Sauces: Classic Buffalo, Honey Garlic, Garlic Parmesan, Lemon Pepper (dry rub), Korean BBQ, Sweet Chili
- Sizes: (6) / (12) / (18) — **insert current prices**
- Cauliflower Wings & Boneless Wings — same size tiers

### Steaks & mains
- Rib Eye Steak — 14oz, truffle fries & slaw
- NY Strip — 10oz, truffle fries, grilled mushrooms
- Coho Salmon — 6oz Chilean salmon, truffle mash, capers sauce
- Picanha Steak — 8oz Brazilian cut, chimichurri, truffle fries
- Fried Shrimp — large (8), fries, tartar
- Fish / Crab Cake plate — lump crab, truffle mash, arugula, tomatoes, caper sauce

### Pizza
- Classic Neapolitan — fresh & traditional mozzarella, basil, tomatoes
- Cheese Pizza
- Meat Lover — pepperoni, Italian sausage, bacon, ham
- Supreme — pepperoni, mushrooms, sausage, tomatoes, mozzarella
- Ham & Pineapple
- Chicken Alfredo — Alfredo, mozzarella, parmesan, olive oil

### Brunch *(Sat & Sun, 9AM – 2PM)*

**Breakfast favorites**
- Classic Two-Egg Breakfast — bacon or sausage, potatoes, toast
- Buttermilk Pancakes — maple syrup, whipped butter; add blueberries or chocolate chips
- French Toast — tropical guava & mango / cinnamon vanilla / churro berries options

**Eggs & skillets**
- Short Rib Hash
- Breakfast Skillet
- Veggie Omelet
- Classic Omelet — cheddar, American, or Swiss

**Brunch plates**
- Steak & Eggs
- Crispy Chicken & Waffles — maple hot sauce
- Salmon Avocado Toast
- Breakfast Sandwich — scrambled eggs, bacon or sausage, American cheese, brioche

---

## Copy fixes (old PDF had errors)

- `ownerbox.com` → **theownersbox.com**
- `lLump` → **Lump**
- `pineaple` → **Pineapple**
- `chese` → **Cheese**
- `Shreed` → **Shredded**
- `iceburg` → **Iceberg**
- `Ny Strips` → **NY Strip**
- Normalize spacing and en-dashes in price add-ons (+6, +8, etc.)

---

## Pricing

- Old PDF has **`00` placeholders** — replace with **real prices** from the restaurant (Hector/ops team).
- If prices are TBD, use **“Market Price”** or leave a clearly marked `[PRICE]` token for one final pass — do not ship with `00`.

---

## Technical export checklist

- [ ] Embedded fonts (or outlined type) so PDF renders consistently in browser iframe
- [ ] File size under **~3 MB** if possible (web embed)
- [ ] Single PDF, no password, no print restrictions
- [ ] Filename: **`menu.pdf`**
- [ ] Final file placed at: **`apps/web/public/menu.pdf`**

---

## Reference files in repo

| File | Purpose |
|------|---------|
| `The owners box menu.pdf` | Original layout/content reference |
| `apps/web/public/menu_text.txt` | OCR/text extraction of old menu |
| `apps/web/public/menu.pdf` | **Current live file** (replace when new design is ready) |
| `apps/web/src/app/menu/page.tsx` | Page that embeds PDF + Order Online button |
| `convex/seedMenu.ts` | Digital menu product names/descriptions (keep PDF aligned where possible) |

---

## Out of scope for this PDF

- Online ordering flows, QR codes to POS, or third-party ordering logos
- App Store badges (those live on the website, not the menu PDF)
