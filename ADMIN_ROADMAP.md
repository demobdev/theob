# Admin Portal Roadmap: The Owner's Box

This document tracks all features required to build the web-based Admin Dashboard for store managers, blending operational tools (like Olo) with guest engagement (like Thanx).

## 🍔 1. Operations & Kitchen (Olo Inspired)

### Menu & Inventory Management
- [ ] **The "86" Button**: 1-click toggles to mark a menu item, modifier, or ingredient as "Out of Stock" across the app instantly.
- [ ] **Price Overrides**: Quickly update the price of an item without altering the seed files.
- [ ] **Category Management**: Reorder or hide entire menu categories (e.g., hiding "Brunch" dynamically).

### Order Pipeline & Throttling
- [ ] **Kitchen Pacing Dial**: Adjust the default quote time (e.g., slide from 15 mins to 45 mins) when the kitchen is slammed.
- [ ] **Emergency Stop**: A manual "Kitchen Closed" override switch that immediately halts incoming online orders mid-shift.
- [ ] **Live Order Board**: A Kanban-style view of active orders: Incoming -> Preparing -> Ready -> Completed.

---

## 🤝 2. Loyalty & CRM (Thanx Inspired)

### Guest Profiles
- [ ] **The "Little Black Book"**: Search for any signed-up user to view their lifetime spend, visit frequency, and average order value.
- [ ] **Order History**: See exactly what a user ordered in the past to help with disputes or highly personalized service.

### Engagement & VIPs
- [ ] **Targeted Rewards**: Query users by behavior (e.g., "Hasn't ordered in 30 days") and drop a "Free App" reward directly into their wallets.
- [ ] **VIP Status Tagging**: Manually tag users as "Legend" or "VIP" to grant them access to hidden menu items or exclusive events.
- [ ] **Feedback Loop Flagging**: If a user leaves a 1-star review post-order, flag it in the dashboard so a manager can send an apology reward.

---

## 🏆 3. The "War Room" / Sports Engine

### Content Management
- [ ] **Live Game Toggles**: Select which live games are featured in the top "Headliners" carousel on the mobile app.
- [ ] **Manual Cache Refresh**: A button to force an immediate refresh of the ESPN sports schedule cache instead of waiting for the cron job.
- [ ] **Betting Promos**: Update the daily parlay or odds boosts shown in the app.

---

## ⚙️ 4. Infrastructure & RBAC

- [ ] **Role-Based Access Control (RBAC)**: Ensure only users with the `role: "admin"` can log into the web portal.
- [ ] **Audit Logs**: Track which manager pressed the "86" button or issued a reward to prevent abuse.
