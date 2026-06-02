import type { Doc } from "../../_generated/dataModel";
import { GREENVILLE_LOCATION } from "../../lib/locations";
import type { GeniusCreateOrderPayload, GeniusFulfillmentType } from "./types";

const destinationToFulfillment = (
  destination?: string,
  fulfillmentMethod?: string,
): GeniusFulfillmentType | null => {
  if (fulfillmentMethod === "pickup_curbside") return "pickup_curbside";
  if (fulfillmentMethod === "pickup_instore") return "pickup_instore";
  if (destination?.toLowerCase().includes("curbside")) return "pickup_curbside";
  if (destination?.toLowerCase().includes("in-store")) return "pickup_instore";
  return null;
};

export function mapConvexOrderToGeniusPayload(
  order: Doc<"orders">,
): GeniusCreateOrderPayload | null {
  const fulfillmentType = destinationToFulfillment(
    order.destination,
    order.fulfillmentMethod,
  );
  if (!fulfillmentType) return null;

  const lines = (order.items as Array<{
    name?: string;
    quantity?: number;
    price?: number;
    instructions?: string;
  }>).map((item) => ({
    name: item.name ?? "Item",
    quantity: item.quantity ?? 1,
    unitPrice: item.price ?? 0,
    instructions: item.instructions,
  }));

  return {
    externalOrderId: order._id,
    siteId: process.env.GENIUS_SITE_ID ?? GREENVILLE_LOCATION.id,
    fulfillmentType,
    destinationLabel: order.destination ?? "Pickup",
    locationAddress: order.location ?? GREENVILLE_LOCATION.fullAddress,
    customerPhone: order.customerPhone,
    pickupTimeLabel: order.pickupTime ?? "ASAP",
    estimatedReadyAt: order.estimatedReadyAt,
    carDetails: order.carDetails,
    lines,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
  };
}
