/** Draft shapes — align with Xenial/Genius integrator docs when credentials arrive. */

export type GeniusFulfillmentType = "pickup_instore" | "pickup_curbside";

export interface GeniusOrderLine {
  name: string;
  quantity: number;
  unitPrice: number;
  instructions?: string;
}

export interface GeniusCreateOrderPayload {
  externalOrderId: string;
  siteId: string;
  fulfillmentType: GeniusFulfillmentType;
  destinationLabel: string;
  locationAddress: string;
  customerPhone?: string;
  pickupTimeLabel: string;
  estimatedReadyAt?: string;
  carDetails?: { make: string; model: string; color: string };
  lines: GeniusOrderLine[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface GeniusSubmitResult {
  ok: boolean;
  posOrderId?: string;
  posStatus?: string;
  errorMessage?: string;
}
