# The Owner’s Box App — Unified UX, Ordering, Delivery Partner, and Loyalty Plan

## Why this merged file exists

This combines:
1. the **mobile UX / ordering / screen structure plan**
2. the **actual menu-based loyalty and reward math**

So the build doc is no longer split between “general app direction” and “reward theory.”  
This version is the cleaner source of truth for design, product, and engineering.

---

## Goal

Build **The Owner’s Box** app as a premium, mobile-first sports bar experience centered around:

- direct ordering
- in-store pickup
- curbside pickup
- future delivery partner handoff
- real-time game utility
- loyalty tied to repeat behavior and game-day energy
- a textured, premium sports-bar visual identity

We are borrowing what works from the pizza app reference, but adapting it to a very different product.

---

# 1. Core UX Patterns To Keep

## 1.1 Top ordering context block

At the top of menu and checkout views, always show:

### Row 1
- current fulfillment method
  - In-Store Pickup
  - Curbside Pickup
  - Delivery

### Row 2
- current location
  - Greenville for now
  - scalable later for multiple locations

### Row 3
- notification / status bar

### Why
This prevents confusion before the user adds anything to cart.

### Example messages
- `You are ordering In-Store Pickup at Greenville.`
- `Curbside Pickup selected for Greenville.`
- `Scheduled pickup for 6:30 PM at Greenville.`
- `Delivery available through partner apps.`
- `Kitchen closes at 10:30 PM tonight.`

### Suggested state shape

```ts
type FulfillmentMethod = "pickup_instore" | "pickup_curbside" | "delivery_partner";

type OrderContext = {
  fulfillmentMethod: FulfillmentMethod;
  locationId: string;
  locationName: string;
  scheduledMode: "asap" | "scheduled";
  scheduledTime?: string | null;
  phone?: string;
  deliveryPartner?: "doordash" | "uber_eats" | "grubhub" | null;
};
```

---

## 1.2 Pickup / curbside / delivery preference modal

When user taps fulfillment or location, open a bottom sheet/modal.

### Sections

#### A. Restaurant location
- Greenville
- street address
- directions later

#### B. Fulfillment method
- In-Store Pickup
- Curbside Pickup
- Delivery

#### C. Timing
- ASAP / Today
- Schedule

#### D. If pickup selected
- pickup time
- phone number
- optional notes

#### E. If curbside selected
- phone number
- vehicle make/model
- vehicle color
- parking spot number later

#### F. If delivery selected
For now, do not fake native internal delivery.

Show:
- DoorDash
- Uber Eats
- Grubhub

With:
- `Delivery is completed on partner platforms.`

### CTA
- `Update Order Preferences`

---

## 1.3 Notification/status bar rules

Use this under the ordering context block.

### Use it for
- active fulfillment reminder
- temporary promos
- store notices
- delayed kitchen notice
- game-day alerts
- delivery partner notice

### Rule
Only one primary message at a time.

- critical context messages are not dismissible
- promo messages can be dismissed

---

## 1.4 Bottom nav structure

Recommended bottom tabs:

- Home
- Games
- Order
- Rewards
- More

### Why
Games is a real differentiator and should not be buried.

### Tab purposes

#### Home
- hero promo
- quick order CTA
- featured categories
- loyalty summary
- next big game
- partner delivery shortcuts

#### Games
- live/upcoming games
- TV assignments
- filters by league/team/time
- game-day promos

#### Order
- categories
- featured combos
- menu cards
- top fulfillment bar
- cart access

#### Rewards
- points balance
- reward catalog
- earn-more section
- missions later
- history later

#### More
- preferences
- support
- notifications
- account
- about
- drawer-like utilities until sidebar exists later

---

# 2. Visual Direction

## 2.1 What to carry over
The reference app uses warm textured surfaces that make the food look better.

## 2.2 What to adapt for Owner’s Box
Use a more premium sports-bar feel:

### Base tones
- warm parchment / tan / muted cream
- charcoal / near-black
- restrained red accents
- optional muted bronze / brass notes

### Texture direction
- subtle paper grain
- soft leather-adjacent texture
- matte scoreboard / premium lounge feel

### Avoid
- loud neon gamer UI
- fake distressed grunge
- over-noised textures
- cluttered sports-betting aesthetic

### Tone
- premium sports lounge
- modern Americana sports bar
- clean, warm, slightly rugged
- classy without getting sleepy

---

# 3. Delivery Partner Strategy

## Current direction
Use the app for:
- direct pickup
- curbside
- loyalty
- game utility

Use third parties for:
- delivery fulfillment for now

## MVP approach
Inside the preferences modal and/or home page delivery card, include:
- DoorDash
- Uber Eats
- Grubhub

### With clear copy
- `Prefer delivery? Order through your favorite delivery app.`
- `Delivery is completed on partner platforms.`

## Do not do yet
- fake native delivery checkout
- pretend internal courier support exists
- create confusing mixed cart logic

---

# 4. Menu-Informed Loyalty Plan

This section replaces the earlier generic reward ladder with a menu-based one.

## 4.1 Loyalty name
# Box Score Rewards

Point unit:
- **Box Score Points**

Examples:
- `You’ve got 108 Box Score Points`
- `17 more points until Free Queso & Chorizo`

---

## 4.2 Base earning
- **1 point per $1 spent on direct app orders**

Applies to:
- in-store pickup
- curbside pickup
- future direct website/app ordering

Does not apply to:
- taxes
- tips
- gift card purchases
- third-party delivery marketplace orders

---

## 4.3 Actual menu categories being considered

### Appetizers
- Crab Dip
- Spicy Bang-Bang Shrimp
- Queso & Chorizo
- Crispy Calamari
- Loaded Short Rib Nachos

### Salads
- Classic Caesar
- Chopped House Salad
- Fried Goat Cheese & Arugula

### Sandwiches
- Chicago
- The Bar Chicken
- Crab Cake
- Classic Philly

### Wings
- Jumbo Wings
- Cauliflower Wings
- Boneless Wings

### Pizza
- Classic Neapolitan
- Cheese Pizza
- Meat Lover
- Supreme Pizza
- Ham & Pineapple
- Chicken Alfredo Pizza

### Fish / premium proteins
- Coho Salmon
- Fried Shrimp
- Crab Cake

### Steaks
- Rib Eye Steak
- NY Strip
- Picanha Steak

### Brunch
- Classic Two-Egg Breakfast
- Buttermilk Pancakes
- French Toast
- Short Rib Hash
- Breakfast Skillet
- Veggie Omelet
- Classic Omelet
- Steak & Eggs
- Crispy Chicken & Waffles
- Salmon Avocado Toast
- Breakfast Sandwich

---

## 4.4 Rewards that must be protected

These should **not** become low-threshold freebies:

- crab dip
- crab cake
- fried shrimp
- coho salmon
- rib eye
- NY strip
- picanha
- steak & eggs
- salmon avocado toast if food cost is high
- loaded short rib nachos unless behind thresholds

These can exist later as:
- premium promos
- milestone unlocks
- spend-threshold rewards
- VIP / event rewards

---

## 4.5 Reward value logic

### Internal model
- **100 points ≈ $5 reward value**
- therefore **1 point ≈ $0.05 internal redemption value**

### Target effective value back
- **5% to 8%** in normal use
- **8% to 12%** during promos / bonus windows

That is generous enough to feel worth it without turning the whole thing into a charity gala.

---

# 5. Launch Reward Ladder (Updated)

This is the cleaner launch ladder and should replace the earlier generic version.

## Recommended V1 Box Score Rewards ladder

- **25 pts** → Free drink
- **50 pts** → Free fries or side
- **75 pts** → Free Caesar or brunch-side reward
- **100 pts** → $5 off
- **125 pts** → Free Queso & Chorizo or Calamari
- **150 pts** → Free Breakfast Sandwich / Chicago / The Bar Chicken
- **200 pts** → $10 off $25+ or 6 jumbo wings
- **250 pts** → Free Cheese Pizza or 12 wings with threshold
- **300 pts** → Free premium pizza or game-day combo

## Why this version is better
It uses the real menu instead of vague stand-ins, and it avoids giving away:
- steak
- seafood
- high-cost brunch plates
like a maniac.

---

# 6. Best Reward Candidates By Menu Fit

## Best low-cost / high-perceived-value
- drink
- fries
- side salad
- brunch side
- sauce add-on
- Caesar
- Breakfast Sandwich
- pancakes
- french toast

## Best mid-tier
- Queso & Chorizo
- Crispy Calamari
- The Bar Chicken
- Chicago
- 6-count wings
- omelet-tier brunch items

## Best premium casual tier
- Cheese Pizza
- Classic Neapolitan
- 12-count wings with minimum spend
- premium appetizer with threshold
- game-day combo credit

---

# 7. Sports-Bar-Specific Loyalty Hooks

This is where Owner’s Box stops being another bland restaurant app.

## 7.1 Game-day multipliers
Examples:
- 2x points on NFL Sundays
- 2x points on college football Saturdays
- 2x points during UFC fight nights
- 2x points on playoff nights
- brunch bonus windows on Saturday/Sunday mornings

### Multiplier rule
- normal: 1x
- selected windows: 2x
- rare promo events: 3x max

Do not run 3x all the time unless you want to professionally donate margin.

---

## 7.2 Missions
Examples:
- Order wings + pizza = +15 bonus points
- First curbside order = +20 points
- 3 direct orders in one month = +30 points
- Brunch order on two Sundays = +25 points
- Try a featured special = +10 points

---

## 7.3 Team pick bonus later
Future feature:
- pick winner before major game
- if order is placed and pick wins, grant bonus points

Good later feature. Not required for V1.

---

## 7.4 Streaks later
Future feature:
- weekly ordering streaks
- repeated game-day participation
- brunch streak rewards

Also later.

---

# 8. Rewards UI Structure

## Rewards home card
Show:
- current points balance
- next reward unlock
- current multiplier / featured bonus window

Example:
- `You’ve got 108 Box Score Points`
- `17 more points until Free Queso & Chorizo`
- `2x points this Saturday for Fight Night`

## Reward sections
Recommended tabs or filters:
- Available
- Earn More
- Game Day Bonuses
- History

## Reward cards
Each card should contain:
- reward image
- reward title
- points cost
- redeem button
- small fine print if needed

---

# 9. Sidebar / Drawer

The earlier doc said this is later, and that is still correct.

## Keep for later phase
Potential future sections:
- Rewards
- Order History
- Notifications
- Saved Payments
- Favorite Orders
- Game Alerts
- Fantasy Picks / Prediction Challenges
- Support
- Account
- About

For now, the `More` tab handles this.

---

# 10. Screen Structure

## Home
- hero promo
- current big game / game-night promo
- quick order CTA
- partner delivery shortcuts
- loyalty summary
- categories

## Games
- live/upcoming matchups
- which TV shows which game
- sport/team filters
- game-night promos

## Order
- fulfillment selector
- location selector
- notification bar
- categories
- menu cards
- featured combos
- cart

## Rewards
- points
- next unlock
- reward catalog
- earn-more explanations
- bonus event callouts

## More
- preferences
- support
- notifications
- account
- about

---

# 11. Data / Engineering Models

## Order context
```ts
type FulfillmentMethod = "pickup_instore" | "pickup_curbside" | "delivery_partner";

type OrderContext = {
  fulfillmentMethod: FulfillmentMethod;
  locationId: string;
  locationName: string;
  scheduledMode: "asap" | "scheduled";
  scheduledTime?: string | null;
  phone?: string;
  deliveryPartner?: "doordash" | "uber_eats" | "grubhub" | null;
};
```

## Rewards
```ts
type RewardDefinition = {
  id: string;
  title: string;
  pointsCost: number;
  rewardType: "free_item" | "discount" | "bundle" | "promo";
  eligibleMenuItemIds?: string[];
  minimumOrderSubtotal?: number | null;
  activeDays?: string[];
  isBrunchOnly?: boolean;
  isGameDayOnly?: boolean;
  isActive: boolean;
};

type PointsLedgerEntry = {
  id: string;
  userId: string;
  type: "earned" | "redeemed" | "bonus" | "expired" | "adjustment";
  points: number;
  source:
    | "order"
    | "promo"
    | "game_day_multiplier"
    | "mission"
    | "manual_adjustment";
  orderId?: string;
  rewardId?: string;
  createdAt: string;
};
```

---

# 12. Suggested Analytics Events

```ts
fulfillment_method_changed
location_changed
schedule_mode_changed
pickup_time_selected
delivery_partner_clicked
reward_viewed
reward_redeemed
bonus_points_awarded
game_promo_opened
notification_bar_dismissed
```

---

# 13. Build Now vs Later

## Build now
- fulfillment/location bar
- notification/status bar
- preferences modal
- in-store / curbside / delivery partner toggles
- location selector
- today vs schedule toggle
- phone number field
- warm textured visual direction
- bottom nav with Games tab
- Box Score Rewards V1
- points balance UI
- reward catalog
- bonus event support
- delivery partner handoff UI

## Build later
- slide-out sidebar
- saved cards / card-linked rewards
- receipt upload
- tiers
- streaks
- prediction bonuses
- advanced missions
- deeper delivery integrations
- full account center

---

# 14. Immediate Modifications Added To The Original Plan

These are the main modifications that needed to be added to the earlier app reference plan:

1. **Replace the generic reward ladder with the actual menu-based ladder**
2. **Protect high-cost steak/seafood/brunch items from low-tier redemption**
3. **Add brunch-specific rewards and multiplier windows**
4. **Add actual menu categories so reward design is grounded**
5. **Add a cleaner launch reward catalog**
6. **Clarify that delivery is partner handoff, not fake native delivery**
7. **Keep sidebar for later instead of stuffing it into MVP**
8. **Tighten Rewards UI around next unlock + event multipliers**
9. **Add reward/data models so engineering can wire it properly**

---

# 15. Final Recommendation

Yes — this merged version is the one you should use.

It is stronger than the original standalone doc because now it has:
- the UX patterns worth copying
- the ordering / fulfillment structure
- the delivery partner logic
- the actual menu-informed reward system
- the engineering shape needed to build it

This should be the source-of-truth planning doc for the Expo build.
