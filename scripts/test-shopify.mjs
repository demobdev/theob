import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const ts = require("typescript");
const modules = new Map();
function load(file) {
  const absolute = path.resolve(root, file);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const code = ts.transpileModule(readFileSync(absolute, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  modules.set(absolute, module);
  const localRequire = (id) => {
    if (id.startsWith("@/"))
      return load(path.join(root, "apps/web/src", id.slice(2)) + ".ts");
    if (id.startsWith("."))
      return load(path.resolve(path.dirname(absolute), id) + ".ts");
    return require(id);
  };
  new Function("require", "module", "exports", code)(
    localRequire,
    module,
    module.exports,
  );
  return module.exports;
}
const shop = await load("apps/web/src/lib/shopify/storefront.ts");
const route = await load("apps/web/src/app/api/shopify/checkout/route.ts");
const originalFetch = globalThis.fetch;
const keys = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "SHOPIFY_CHECKOUT_ENABLED",
  "NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLES",
  "NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE",
];
const originalEnv = Object.fromEntries(
  keys.map((key) => [key, process.env[key]]),
);
process.env.SHOPIFY_STORE_DOMAIN = "fixture.myshopify.com";
process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "fixture-only";
process.env.SHOPIFY_CHECKOUT_ENABLED = "true";
process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLES =
  "the-ob-quarter-zip,the-ob-crew-tee";

const variant = (size, id, available, amount = "20.00") => ({
  id: `gid://shopify/ProductVariant/${id}`,
  title: size,
  selectedOptions: [{ name: "Size", value: size }],
  availableForSale: available,
  price: { amount, currencyCode: "USD" },
});
const small = variant("S", 1, false);
const medium = variant("M", 2, true);
const large = variant("L", 3, true, "22.00");
function product(
  nodes = [small, medium, large],
  pageInfo = { hasNextPage: false, endCursor: null },
) {
  return {
    id: "gid://shopify/Product/8750754103454",
    title: "The OB Crew Tee",
    handle: "the-ob-crew-tee",
    description: "Black tee",
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: "20.00", currencyCode: "USD" } },
    variants: { pageInfo, edges: nodes.map((node) => ({ node })) },
  };
}
function mock(handler) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, ...body, cache: options.cache });
    const data = await handler(body, calls.length);
    return Response.json({ data });
  };
  return calls;
}
function cart(id = medium.id, quantity = 1) {
  return {
    cartCreate: {
      cart: {
        checkoutUrl: "https://fixture.myshopify.com/checkouts/test",
        lines: { nodes: [{ quantity, merchandise: { id } }] },
      },
      userErrors: [],
    },
  };
}
const request = (body) =>
  new Request("http://localhost/api/shopify/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });

try {
  await test("first unavailable size does not hide available variants; all sizes and prices survive mapping", async () => {
    const calls = mock(() => ({ product: product() }));
    const result = await shop.getShopifyProduct();
    assert.deepEqual(
      result.variants.map((v) => v.availableForSale),
      [false, true, true],
    );
    assert.equal(result.variants[1].id, medium.id);
    assert.equal(result.variants[2].priceAmount, "22.00");
    assert.deepEqual(result.variants[1].selectedOptions, [
      { name: "Size", value: "M" },
    ]);
    assert.match(calls[0].query, /variants\(first: 100, after: \$after\)/);
    assert.match(calls[0].url, /2026-10/);
  });
  await test("tee scope ignores old multi-product environment settings and rejects other handles", async () => {
    const calls = mock(() => ({ product: product() }));
    assert.deepEqual(shop.getShopifyProductHandles(), ["the-ob-crew-tee"]);
    assert.equal(await shop.getShopifyProduct("the-ob-quarter-zip"), null);
    assert.equal(calls.length, 0);
    assert.equal((await shop.getShopifyProducts()).length, 1);
    assert.equal(calls[0].variables.handle, "the-ob-crew-tee");
  });
  await test("variant pagination includes sizes after the first page", async () => {
    const calls = mock((_, count) => ({
      product:
        count === 1
          ? product([small], { hasNextPage: true, endCursor: "next" })
          : product([medium]),
    }));
    assert.equal((await shop.getShopifyProduct()).variants.length, 2);
    assert.equal(calls[1].variables.after, "next");
  });
  await test("empty, missing, unconfigured, and failed catalogs safely return no products", async () => {
    for (const value of [null, product([])]) {
      mock(() => ({ product: value }));
      assert.deepEqual(await shop.getShopifyProducts(), []);
    }
    globalThis.fetch = async () => {
      throw Error("offline");
    };
    assert.deepEqual(await shop.getShopifyProducts(), []);
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    assert.deepEqual(await shop.getShopifyProducts(), []);
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "fixture-only";
  });
  await test("Coming Soon blocks API even when credentials exist", async () => {
    const calls = mock(() => {
      throw Error("must not call Shopify");
    });
    for (const value of [undefined, "false"]) {
      if (value === undefined) delete process.env.SHOPIFY_CHECKOUT_ENABLED;
      else process.env.SHOPIFY_CHECKOUT_ENABLED = value;
      assert.equal(shop.isShopifyCheckoutEnabled(), false);
      assert.equal(
        (await route.POST(request({ variantId: medium.id }))).status,
        503,
      );
    }
    assert.equal(calls.length, 0);
    process.env.SHOPIFY_CHECKOUT_ENABLED = "true";
  });
  await test("no selection, malformed JSON values, and unknown product variants cannot create carts", async () => {
    const calls = mock(() => ({ product: product() }));
    for (const body of [
      {},
      { variantId: null },
      { variantId: 3 },
      [],
      { variantId: "invalid" },
    ]) {
      assert.equal((await route.POST(request(body))).status, 400);
    }
    assert.equal(calls.length, 0);
    assert.equal(
      (
        await route.POST(
          request({ variantId: "gid://shopify/ProductVariant/999" }),
        )
      ).status,
      400,
    );
    assert.equal(calls.length, 1);
  });
  await test("fresh stock check rejects an unavailable chosen size without creating a cart", async () => {
    const calls = mock(() => ({ product: product() }));
    assert.equal(
      (await route.POST(request({ variantId: small.id }))).status,
      409,
    );
    assert.equal(calls.length, 1);
    assert.equal(calls[0].cache, "no-store");
  });
  await test("each changed selection hands the exact selected ID and quantity to the existing cart checkout", async () => {
    const calls = mock((body) =>
      body.query.includes("mutation")
        ? cart(body.variables.input.lines[0].merchandiseId)
        : { product: product() },
    );
    for (const chosen of [medium, large, medium]) {
      const result = await route.POST(request({ variantId: chosen.id }));
      assert.equal(result.status, 200);
      assert.equal(
        (await result.json()).checkoutUrl,
        "https://fixture.myshopify.com/checkouts/test",
      );
      const last = calls.at(-1);
      assert.deepEqual(last.variables.input.lines, [
        { merchandiseId: chosen.id, quantity: 1 },
      ]);
      assert.equal(last.cache, "no-store");
    }
  });
  await test("stale stock, removed lines, wrong variants, and wrong quantities never redirect to an incorrect cart", async () => {
    for (const result of [
      cart(small.id),
      cart(medium.id, 0),
      {
        cartCreate: {
          cart: {
            checkoutUrl: "https://fixture.myshopify.com/checkouts/test",
            lines: { nodes: [] },
          },
          userErrors: [],
        },
      },
    ]) {
      mock((body) =>
        body.query.includes("mutation") ? result : { product: product() },
      );
      assert.equal(
        (await route.POST(request({ variantId: medium.id }))).status,
        502,
      );
    }
  });
  await test("Shopify cart errors and API failure return a recoverable checkout error", async () => {
    mock((body) =>
      body.query.includes("mutation")
        ? {
            cartCreate: {
              cart: null,
              userErrors: [{ field: ["input"], message: "unavailable" }],
            },
          }
        : { product: product() },
    );
    assert.equal(
      (await route.POST(request({ variantId: medium.id }))).status,
      502,
    );
    globalThis.fetch = async () =>
      Response.json({ errors: [{ message: "denied" }] });
    const response = await route.POST(request({ variantId: medium.id }));
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /Please try again/);
  });
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
}
