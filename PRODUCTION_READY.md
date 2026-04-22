# Production Readiness Roadmap: The Owner's Box

This document tracks all critical requirements and "Work in Progress" items needed to transition from development to a live production environment.

## 🔴 High Priority (Blocking Production)

### 💳 Payments
- [ ] **Live Gateway Integration**: Swap the `mockTokenize` utility in `AddCardScreen.tsx` for the real GeniuS/Xenial POS SDK.
- [ ] **Apple/Google Pay**: Implement native payment sheets for one-tap checkouts.
- [ ] **Transaction Receipts**: Ensure Convex generates and emails a receipt after every successful transaction.

### 🔐 Authentication & Security
- [ ] **Clerk Production Keys**: Switch from `.dev` to live production domain and keys.
- [ ] **Data Privacy**: Audit `convex/schema.ts` to ensure no PII (Personally Identifiable Information) is exposed via insecure queries.
- [ ] **Terms & Privacy**: Update `TermsScreen.tsx` and `PrivacyPolicyScreen.tsx` with actual legal copy.

### 🏟️ Live Data
- [ ] **Sportradar API**: Move from demo/mock scores to a live Sportradar subscription for real-time War Room updates.
- [ ] **Redundancy**: Implement a fallback data source if the primary sports API hits rate limits.

---

## 🟡 Medium Priority (Polishing & Operations)

### 🍔 Menu Management
- [ ] **Admin Portal**: Build the web-based admin interface to allow managers to change prices or mark items as "Out of Stock" instantly.
- [ ] **Store Hours**: Implement logic to disable "Online Ordering" when the kitchen is closed.

### 📈 Loyalty & Marketing
- [ ] **Birthday Rewards**: Automate the delivery of the $5 off reward on the user's birthday.
- [ ] **Push Notifications**: Wire up Expo Notifications to alert users when their order is ready or a big game is starting.

---

## 🟢 Low Priority (Future Enhancements)
- [ ] **Social Sharing**: Allow users to share their "War Room" parlays or favorite dishes to Instagram.
- [ ] **Table QR Codes**: Unique QR codes for in-store tables to bypass the waitstaff for drink refills.

---

## 🛠️ Infrastructure Checklist
- [x] **Convex Schema**: Production-grade schema with indexes.
- [ ] **Error Logging**: Integrate Sentry or LogRocket for real-time app crash monitoring.
- [ ] **App Store Submission**: Complete the metadata, screenshots, and ratings for iOS/Android stores.
