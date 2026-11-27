"use client";

import { useEffect, useRef, useState } from "react";

type AltHomeShopBuyButtonProps = {
  variantId: string | null;
  disabled?: boolean;
  label?: string;
};

export default function AltHomeShopBuyButton({
  variantId,
  disabled = false,
  label = "Shop Now",
}: AltHomeShopBuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);

  async function handleCheckout() {
    if (disabled || !variantId || pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
        signal: controller.signal,
      });
      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Unable to start checkout");
      }
      if (!controller.signal.aborted) window.location.href = data.checkoutUrl;
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Checkout failed");
        setLoading(false);
      }
    } finally {
      pending.current = null;
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || !variantId || loading}
        className="inline-flex rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-[3px_3px_0_#D4AF37] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Opening checkout..." : label}
      </button>
      {error ? (
        <p
          role="alert"
          className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
