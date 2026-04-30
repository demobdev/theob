<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Owner's Box React Native app. `posthog-react-native` was already installed and `PostHogProvider` was already present — the integration focused on instrumenting 13 business-critical events across 8 screens, adding user identification on login/sign-up, adding error tracking on key failure paths, and repositioning `PostHogProvider` inside `NavigationContainer` for React Navigation v7 compatibility.

**Files modified:**

- `apps/native/App.tsx` — moved `PostHogProvider` inside `NavigationContainer` (required for React Navigation v7 autocapture)
- `apps/native/.env` — set `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`
- `apps/native/src/screens/OnboardingScreen.tsx` — `onboarding_completed`
- `apps/native/src/screens/LoginScreen.tsx` — `sign_in_completed`, `sign_up_completed`, `posthog.identify()`
- `apps/native/src/screens/ProductDetailScreen.tsx` — `product_added_to_cart`
- `apps/native/src/screens/CartScreen.tsx` — `checkout_started`, `order_placed`, `reward_applied_to_cart`, `$exception`
- `apps/native/src/screens/RewardDetailScreen.tsx` — `reward_detail_viewed`
- `apps/native/src/screens/RedeemInStoreScreen.tsx` — `reward_redeemed`, `$exception`
- `apps/native/src/screens/RewardsScreen.tsx` — `birthday_reward_claimed`, `promo_banner_tapped`, `member_qr_viewed`
- `apps/native/src/screens/UploadReceiptScreen.tsx` — `receipt_submitted`

## Events

| Event | Description | File |
|---|---|---|
| `onboarding_completed` | User finishes the onboarding carousel and proceeds to login | `OnboardingScreen.tsx` |
| `sign_in_completed` | User successfully signs in (SSO or email code) | `LoginScreen.tsx` |
| `sign_up_completed` | User creates a new account and verifies their email | `LoginScreen.tsx` |
| `product_added_to_cart` | User adds a menu item to the cart | `ProductDetailScreen.tsx` |
| `checkout_started` | User taps Proceed to Checkout | `CartScreen.tsx` |
| `order_placed` | User completes an order | `CartScreen.tsx` |
| `reward_applied_to_cart` | User toggles a reward on in the cart rewards carousel | `CartScreen.tsx` |
| `reward_detail_viewed` | User opens a reward detail page | `RewardDetailScreen.tsx` |
| `reward_redeemed` | User confirms in-store redemption of a reward | `RedeemInStoreScreen.tsx` |
| `birthday_reward_claimed` | User claims their annual 150-point birthday bonus | `RewardsScreen.tsx` |
| `promo_banner_tapped` | User taps the featured limited-time promo banner | `RewardsScreen.tsx` |
| `member_qr_viewed` | User opens their member QR code | `RewardsScreen.tsx` |
| `receipt_submitted` | User submits a receipt to claim missed points | `UploadReceiptScreen.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics](https://us.posthog.com/project/401878/dashboard/1529639)
- **Insight 1:** [Order Funnel: Cart → Checkout → Placed](https://us.posthog.com/project/401878/insights/j1jAPPa9) — conversion funnel across the full order flow
- **Insight 2:** [New Sign-ups & Sign-ins Over Time](https://us.posthog.com/project/401878/insights/zqFSAHQ1) — daily user acquisition and returning engagement
- **Insight 3:** [Rewards Engagement Funnel](https://us.posthog.com/project/401878/insights/22dcWz8L) — rewards redemption journey drop-off
- **Insight 4:** [Total Orders Placed (30 days)](https://us.posthog.com/project/401878/insights/wlYivopk) — headline order volume metric
- **Insight 5:** [Loyalty & Promo Engagement Over Time](https://us.posthog.com/project/401878/insights/aoQcdR7v) — promo taps, birthday claims, and receipt submissions

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
