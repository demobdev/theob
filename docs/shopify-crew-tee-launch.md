# Crew tee storefront launch

This first drop uses only `the-ob-crew-tee`. Legacy public single/multiple product-handle environment variables are intentionally ignored, so the quarter zip cannot enter this drop through configuration. The existing black tee display asset remains unchanged. A website mockup is not print artwork; use the approved original brand file when verifying fulfillment.

## Launch gate

`SHOPIFY_CHECKOUT_ENABLED` is a server-only switch. Its default is off. Missing credentials, an empty or failed catalog, and a disabled gate keep the existing Coming Soon treatment. The checkout API also returns 503 while the gate is off.

Keep this switch off for a Partner development store. Before enabling it, verify:

- The merchant store can accept real customer payments.
- The tee and all intended sizes are published to the Storefront API channel used by this site's token; Online Store publication alone does not verify this path.
- The product uses the approved black tee artwork, correct size mapping and retail price.
- Printful is connected to the correct merchant store, each size is synced, and shipping, fulfillment and return arrangements are approved.
- The chosen size reaches Shopify checkout with quantity one, correct price, currency and shipping. Order/payment submission requires separate authorization.

The browser must explicitly choose a variant. Availability and price follow that choice. Shopify availability means available to order; this does not promise locally held inventory. The checkout route refreshes the tee without cache, rejects foreign or unavailable variants, and verifies the created cart contains the exact selected variant and quantity before returning Shopify's checkout URL. Changing a size cancels the previous browser checkout request.

## Local verification

Run from the repository root:

```powershell
npm run test:shopify
npm run typecheck --workspace=web-app
npm run build --workspace=web-app
```

The regression suite mocks every Shopify request and uses the existing web TypeScript dependency. It covers unavailable first size with later sizes available, missing selection, variant changes, tee-only scope, pagination, empty/failing catalog, gate enforcement, fresh stock checks and incorrect cart responses. A build also needs the app's existing non-commerce environment, including a valid Clerk publishable-key configuration.

The Storefront API is pinned to 2026-10; the previous 2024-10 endpoint was beyond its supported version window. Both generated operations have been schema-validated for 2026-10. Live Storefront channel access and Printful fulfillment still require merchant verification before launch.
