"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import AppStoreBadges from "@/components/common/AppStoreBadges";
import Link from "next/link";
import { Smartphone, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 container mx-auto px-4 py-24 max-w-xl text-center">
        <div className="h-16 w-16 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black mx-auto mb-8">
          <Smartphone className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
          Continue in the App
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed mb-10">
          Web checkout is coming soon. For pickup, curbside, and rewards on every order, finish in The Owner&apos;s Box app — same menu, faster checkout.
        </p>
        <AppStoreBadges className="items-center mb-10" />
        <Link href="/menu">
          <button
            type="button"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-[#D4AF37]/50 transition-all"
          >
            <ShoppingBag size={18} className="text-[#D4AF37]" />
            Back to Menu
          </button>
        </Link>
      </section>
      <Footer />
    </main>
  );
}
