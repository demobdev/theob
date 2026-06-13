import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";
import { normalizeImageSlug } from "./lib/menuImagePaths";
import type { ActionCtx } from "./_generated/server";

function resolveFoodFileSlug(slug: string): string {
  const aliases: Record<string, string> = {
    crab_cake: "crabcake_sandwich",
    "bud-light": "bud_light",
  };
  return aliases[slug] ?? slug;
}

const syncResultValidator = v.object({
  uploaded: v.number(),
  skipped: v.number(),
  failed: v.array(v.string()),
});

type SyncArgs = { baseUrl: string; force?: boolean };

async function syncProductImages(
  ctx: ActionCtx,
  args: SyncArgs,
): Promise<{ uploaded: number; skipped: number; failed: string[] }> {
  const products = await ctx.runQuery(
    internal.menuImages.listProductsForImageSync,
  );
  const base = args.baseUrl.replace(/\/$/, "");
  let uploaded = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const product of products) {
    const image = product.image;
    if (!image) {
      skipped++;
      continue;
    }
    if (
      (image.startsWith("http://") || image.startsWith("https://")) &&
      !args.force
    ) {
      skipped++;
      continue;
    }

    const slug = resolveFoodFileSlug(normalizeImageSlug(image));
    const url = `${base}/images/food/${slug}.png`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        failed.push(`${product.name}: ${url} (${response.status})`);
        continue;
      }
      const blob = await response.blob();
      const storageId = await ctx.storage.store(blob);
      await ctx.runMutation(internal.menuImages.setProductImageFromStorage, {
        productId: product._id,
        storageId,
      });
      uploaded++;
    } catch (error) {
      failed.push(
        `${product.name}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return { uploaded, skipped, failed };
}

export const syncProductImagesToStorageInternal = internalAction({
  args: {
    baseUrl: v.string(),
    force: v.optional(v.boolean()),
  },
  returns: syncResultValidator,
  handler: async (ctx, args) => syncProductImages(ctx, args),
});

export const syncProductImagesToStorage = action({
  args: {
    baseUrl: v.string(),
    force: v.optional(v.boolean()),
  },
  returns: syncResultValidator,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await syncProductImages(ctx, args);
  },
});
