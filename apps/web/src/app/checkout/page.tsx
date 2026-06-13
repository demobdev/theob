"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import AppComingSoonBadges from "@/components/common/AppComingSoonBadges";
import HeartlandOrderLink from "@/components/common/HeartlandOrderLink";
import DoorDashButton from "@/components/common/DoorDashButton";
import Link from "next/link";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";

export default function CheckoutPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 container mx-auto px-4 py-24 max-w-xl text-center">
        <div className="h-16 w-16 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black mx-auto mb-8">
          <UtensilsCrossed className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
          Order Takeout or Delivery
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed mb-10">
          The menu on this site is for browsing only. Use Order Takeout in the header for pickup through our Heartland site, or DoorDash for delivery. Mobile apps are launching soon.
        </p>

        <div className="flex flex-col gap-4 mb-10">
          <HeartlandOrderLink className="w-full">
            <span className="inline-flex w-full justify-center px-8 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs gold-glow hover:scale-[1.02] transition-all cursor-pointer">
              Order Takeout
            </span>
          </HeartlandOrderLink>
          <DoorDashButton fullWidth />
        </div>

        <AppComingSoonBadges className="items-center mb-10" />

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
