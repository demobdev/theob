/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as admin_loyalty from "../admin_loyalty.js";
import type * as admin_orders from "../admin_orders.js";
import type * as admin_products from "../admin_products.js";
import type * as admin_sports from "../admin_sports.js";
import type * as crons from "../crons.js";
import type * as lib_requireAdmin from "../lib/requireAdmin.js";
import type * as loyalty from "../loyalty.js";
import type * as notes from "../notes.js";
import type * as openai from "../openai.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as seedMenu from "../seedMenu.js";
import type * as seedRewards from "../seedRewards.js";
import type * as sports_leagues from "../sports/leagues.js";
import type * as sports_sportradar_client from "../sports/sportradar/client.js";
import type * as sports_sportradar_images from "../sports/sportradar/images.js";
import type * as sports_sportradar_normalize from "../sports/sportradar/normalize.js";
import type * as sports_sportradar_sync from "../sports/sportradar/sync.js";
import type * as sports_types from "../sports/types.js";
import type * as sports_actions from "../sports_actions.js";
import type * as sports_mutations from "../sports_mutations.js";
import type * as sports_queries from "../sports_queries.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  admin_loyalty: typeof admin_loyalty;
  admin_orders: typeof admin_orders;
  admin_products: typeof admin_products;
  admin_sports: typeof admin_sports;
  crons: typeof crons;
  "lib/requireAdmin": typeof lib_requireAdmin;
  loyalty: typeof loyalty;
  notes: typeof notes;
  openai: typeof openai;
  orders: typeof orders;
  payments: typeof payments;
  products: typeof products;
  seed: typeof seed;
  seedMenu: typeof seedMenu;
  seedRewards: typeof seedRewards;
  "sports/leagues": typeof sports_leagues;
  "sports/sportradar/client": typeof sports_sportradar_client;
  "sports/sportradar/images": typeof sports_sportradar_images;
  "sports/sportradar/normalize": typeof sports_sportradar_normalize;
  "sports/sportradar/sync": typeof sports_sportradar_sync;
  "sports/types": typeof sports_types;
  sports_actions: typeof sports_actions;
  sports_mutations: typeof sports_mutations;
  sports_queries: typeof sports_queries;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
