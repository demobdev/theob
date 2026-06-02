import type { FulfillmentMethod } from "../context/OrderContext";
import { GREENVILLE } from "../constants/location";

export type OrderValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function validateOrderForCheckout(params: {
  isSignedIn: boolean;
  fulfillmentMethod: FulfillmentMethod;
  phoneNumber: string;
  vehicleInfo: { make: string; model: string; color: string };
  itemCount: number;
  kitchenOpen: boolean;
}): OrderValidationResult {
  if (!params.isSignedIn) {
    return { ok: false, message: "Sign in to place your order." };
  }
  if (!params.kitchenOpen) {
    return {
      ok: false,
      message: "Kitchen is closed. Online ordering is 11 AM – 10 PM.",
    };
  }
  if (params.itemCount < 1) {
    return { ok: false, message: "Your cart is empty." };
  }
  if (params.fulfillmentMethod === "delivery_partner") {
    return {
      ok: false,
      message:
        "Delivery is through DoorDash, Uber Eats, or Grubhub — use the links on the menu, not in-app checkout.",
    };
  }

  const digits = normalizePhone(params.phoneNumber);
  if (digits.length < 10) {
    return {
      ok: false,
      message: "Add a phone number so we can reach you about your order.",
    };
  }

  if (params.fulfillmentMethod === "pickup_curbside") {
    const { make, model, color } = params.vehicleInfo;
    if (!make.trim() || !model.trim() || !color.trim()) {
      return {
        ok: false,
        message: "Add your vehicle make, model, and color for curbside pickup.",
      };
    }
  }

  return { ok: true };
}

export function destinationLabel(method: FulfillmentMethod): string {
  switch (method) {
    case "pickup_instore":
      return "In-Store Pickup";
    case "pickup_curbside":
      return "Curbside Pickup";
    case "delivery_partner":
      return "Delivery";
  }
}

export { GREENVILLE };
