export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  priceAmount: string;
  priceCurrency: string;
  variantId: string;
  availableForSale: boolean;
};

type ShopifyConfig = {
  storeDomain: string;
  accessToken: string;
  productHandle: string;
};

export function getShopifyConfig(): ShopifyConfig | null {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "");
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const productHandle =
    process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE?.trim() || "ob-crew-tee";

  if (!storeDomain || !accessToken) return null;

  return { storeDomain, accessToken, productHandle };
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfig() !== null;
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache },
): Promise<T> {
  const config = getShopifyConfig();
  if (!config) {
    throw new Error("Shopify is not configured");
  }

  const response = await fetch(
    `https://${config.storeDomain}/api/2024-10/graphql.json`,
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

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Shopify API returned no data");
  }

  return json.data;
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage {
        url
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
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
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
        };
      }>;
    };
  } | null;
};

export async function getShopifyProduct(
  handle?: string,
): Promise<ShopifyProduct | null> {
  const config = getShopifyConfig();
  if (!config) return null;

  const data = await shopifyFetch<ProductByHandleResponse>(PRODUCT_BY_HANDLE_QUERY, {
    handle: handle ?? config.productHandle,
  });

  const product = data.product;
  const variant = product?.variants.edges[0]?.node;
  if (!product || !variant) return null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    imageUrl: product.featuredImage?.url ?? null,
    imageAlt: product.featuredImage?.altText ?? product.title,
    priceAmount: variant.price.amount,
    priceCurrency: variant.price.currencyCode,
    variantId: variant.id,
    availableForSale: variant.availableForSale,
  };
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: { checkoutUrl: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
};

export async function createShopifyCheckout(variantId: string, quantity = 1): Promise<string> {
  const data = await shopifyFetch<CartCreateResponse>(
    CART_CREATE_MUTATION,
    {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
    { cache: "no-store" },
  );

  const errors = data.cartCreate.userErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  const checkoutUrl = data.cartCreate.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Shopify did not return a checkout URL");
  }

  return checkoutUrl;
}

export function formatShopifyPrice(amount: string, currencyCode: string): string {
  const value = Number.parseFloat(amount);
  if (Number.isNaN(value)) return amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}
