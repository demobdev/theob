export type ShopifyVariant = {
  id: string;
  title: string;
  selectedOptions: Array<{ name: string; value: string }>;
  priceAmount: string;
  priceCurrency: string;
  availableForSale: boolean;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  priceAmount: string;
  priceCurrency: string;
  variants: ShopifyVariant[];
};

type ShopifyConfig = {
  storeDomain: string;
  accessToken: string;
  productHandles: string[];
};

// This first drop is deliberately limited to the approved black crew tee.
export const CREW_TEE_HANDLE = "the-ob-crew-tee";

export function getShopifyProductHandles(): string[] {
  return [CREW_TEE_HANDLE];
}

export function getShopifyConfig(): ShopifyConfig | null {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(
    /^https?:\/\//,
    "",
  );
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (!storeDomain || !accessToken) return null;
  return {
    storeDomain,
    accessToken,
    productHandles: getShopifyProductHandles(),
  };
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfig() !== null;
}

// Enable only after the merchant store, Storefront channel, and fulfillment are verified.
export function isShopifyCheckoutEnabled(): boolean {
  return (
    isShopifyConfigured() && process.env.SHOPIFY_CHECKOUT_ENABLED === "true"
  );
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache },
): Promise<T> {
  const config = getShopifyConfig();
  if (!config) throw new Error("Shopify is not configured");

  const response = await fetch(
    `https://${config.storeDomain}/api/2026-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: options?.cache ?? "force-cache",
      next: options?.cache === "no-store" ? undefined : { revalidate: 300 },
    },
  );

  if (!response.ok) throw new Error(`Shopify API error: ${response.status}`);
  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length)
    throw new Error(json.errors.map((e) => e.message).join(", "));
  if (!json.data) throw new Error("Shopify API returned no data");
  return json.data;
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!, $after: String) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            title
            selectedOptions { name value }
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  }
`;

type ProductByHandleResponse = {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    featuredImage: { url: string; altText: string | null } | null;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    variants: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      edges: Array<{
        node: {
          id: string;
          title: string;
          selectedOptions: Array<{ name: string; value: string }>;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
        };
      }>;
    };
  } | null;
};

export async function getShopifyProduct(
  handle = CREW_TEE_HANDLE,
  options?: { cache?: RequestCache },
): Promise<ShopifyProduct | null> {
  if (!getShopifyConfig() || handle !== CREW_TEE_HANDLE) return null;

  const variants: ShopifyVariant[] = [];
  let after: string | null = null;
  let product: ProductByHandleResponse["product"];
  do {
    const data: ProductByHandleResponse =
      await shopifyFetch<ProductByHandleResponse>(
        PRODUCT_BY_HANDLE_QUERY,
        { handle, after },
        options,
      );
    product = data.product;
    if (!product || product.handle !== CREW_TEE_HANDLE) return null;
    variants.push(
      ...product.variants.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        selectedOptions: node.selectedOptions,
        priceAmount: node.price.amount,
        priceCurrency: node.price.currencyCode,
        availableForSale: node.availableForSale,
      })),
    );
    const pageInfo: { hasNextPage: boolean; endCursor: string | null } =
      product.variants.pageInfo;
    if (!pageInfo.hasNextPage) break;
    if (!pageInfo.endCursor || pageInfo.endCursor === after) {
      throw new Error("Shopify returned incomplete variants");
    }
    after = pageInfo.endCursor;
  } while (true);

  if (!variants.length) return null;
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    imageUrl: product.featuredImage?.url ?? null,
    imageAlt: product.featuredImage?.altText ?? product.title,
    priceAmount: product.priceRange.minVariantPrice.amount,
    priceCurrency: product.priceRange.minVariantPrice.currencyCode,
    variants,
  };
}

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  try {
    const product = await getShopifyProduct();
    return product ? [product] : [];
  } catch {
    return [];
  }
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
        lines(first: 2) {
          nodes {
            quantity
            merchandise { ... on ProductVariant { id } }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: {
      checkoutUrl: string;
      lines: {
        nodes: Array<{ quantity: number; merchandise: { id: string } }>;
      };
    } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
};

export async function createShopifyCheckout(
  variantId: string,
  quantity = 1,
): Promise<string> {
  const data = await shopifyFetch<CartCreateResponse>(
    CART_CREATE_MUTATION,
    { input: { lines: [{ merchandiseId: variantId, quantity }] } },
    { cache: "no-store" },
  );
  const errors = data.cartCreate.userErrors;
  if (errors.length) throw new Error(errors.map((e) => e.message).join(", "));
  const cart = data.cartCreate.cart;
  if (!cart?.checkoutUrl)
    throw new Error("Shopify did not return a checkout URL");
  const lines = cart.lines.nodes;
  if (
    lines.length !== 1 ||
    lines[0].merchandise.id !== variantId ||
    lines[0].quantity !== quantity
  ) {
    throw new Error(
      "Your selected size is no longer available. Please choose again.",
    );
  }
  return cart.checkoutUrl;
}

export { formatShopifyPrice } from "./pricing";
