"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Search, Download, ShoppingBag, ChevronRight, Menu as MenuIcon } from "lucide-react";
import ProductCard from "@/components/menu/ProductCard";
import ProductDetailModal from "@/components/menu/ProductDetailModal";
import CartDrawer from "@/components/menu/CartDrawer";
import LocationCard from "@/components/menu/LocationCard";
import { useCart } from "@/hooks/useCart";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { categoryHeroImage } from "@/lib/categoryHero";

export default function MenuPage() {
  const categories = useQuery(api.products.getCategories);
  const products = useQuery(api.products.getAllProducts);
  const { items, fulfillment, location, setFulfillmentModalOpen } = useCart();
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Doc<"products"> | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
    // Show fulfillment modal if not set
    if (!fulfillment) {
      setFulfillmentModalOpen(true);
    }
  }, [categories, fulfillment]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const productsByCategory = categories?.map(cat => ({
    ...cat,
    items: filteredProducts?.filter(p => p.categoryId === cat._id) || []
  })).filter(cat => cat.items.length > 0);

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      
      {/* Dynamic Fulfillment Banner (Sonny's Style) */}
      <div className="bg-[#D4AF37] py-3 text-center">
         <p className="text-black text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            You are ordering <span className="underline decoration-black/30 underline-offset-4">{fulfillment === "delivery" ? "Delivery" : fulfillment === "curbside" ? "Curbside Pickup" : "In-Store Pickup"}</span> at <span className="font-bold underline decoration-black/30 underline-offset-4">{location}</span>
         </p>
      </div>

      {/* Premium Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero.png" 
            fill 
            className="object-cover opacity-60 scale-105" 
            alt="The Owner's Box Menu Hero" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4">
           <div className="inline-block p-12 md:p-20 border border-white/20 backdrop-blur-xl rounded-[40px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
              <div className="relative z-10">
                <span className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 block">
                   Real Smoke • Real Craft
                </span>
                <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                  Menu
                </h1>
                <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                  The Lineup Built for Regulars
                </p>
              </div>
           </div>
        </div>

        {/* Curbside Indicator - Top Left */}
        <button
          type="button"
          onClick={() => setFulfillmentModalOpen(true)}
          className="absolute top-8 left-8 z-20 hidden md:block max-w-sm cursor-pointer text-left"
        >
          <LocationCard />
        </button>

        {/* Download Menu Button - Top Right */}
        <div className="absolute top-8 right-8 z-20">
           <a 
            href="/menu.pdf" 
            download 
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white transition-all group"
           >
              <Download size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase tracking-widest text-[10px]">Download PDF</span>
           </a>
        </div>
      </section>

      {/* Main Layout */}
      <section className="noise-overlay pb-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 relative -mt-20 z-30">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
             <div className="sticky top-28 space-y-6">
                <div className="premium-card p-3 sm:p-4 lg:p-6 border-white/10 bg-black/80 backdrop-blur-xl">
                   <h3 className="text-white font-black uppercase tracking-widest text-[10px] lg:text-xs mb-2 lg:mb-6 flex items-center gap-2 px-1">
                     <MenuIcon size={12} className="text-[#D4AF37] lg:w-3.5 lg:h-3.5" />
                     Categories
                   </h3>
                   <div className="relative lg:static -mx-1 lg:mx-0">
                     <div
                       aria-hidden
                       className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#121212] to-transparent lg:hidden"
                     />
                     <div
                       aria-hidden
                       className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#121212] to-transparent lg:hidden"
                     />
                     <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-1.5 lg:gap-1 px-1 lg:px-0 pb-0.5 lg:pb-0">
                        {categories?.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => scrollToCategory(cat._id)}
                            className={`shrink-0 flex items-center justify-between px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap lg:whitespace-normal text-left ${
                              activeCategory === cat._id 
                                ? "bg-[#D4AF37] text-black" 
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {cat.name}
                            <ChevronRight size={12} className={`hidden lg:block ${activeCategory === cat._id ? "opacity-100" : "opacity-0"}`} />
                          </button>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search menu..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold uppercase tracking-widest focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
                
                {/* Promo Banner */}
                <div className="premium-card p-6 border-[#D4AF37]/20 bg-[#D4AF37]/5">
                   <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black mb-4 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      <span className="font-black text-[10px]">$5</span>
                   </div>
                   <h4 className="text-white font-black uppercase tracking-tight text-xs mb-2">Join the Roster</h4>
                   <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest leading-relaxed mb-4">
                     Sign up now and get $5 off your next order over $25.
                   </p>
                   <button className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] hover:underline">
                     Learn More
                   </button>
                </div>
             </div>
          </aside>

          {/* Product Feed */}
          <div className="flex-1 space-y-24">
             {productsByCategory?.map((category) => (
                <div 
                  key={category._id} 
                  ref={el => { categoryRefs.current[category._id] = el; }}
                  className="scroll-mt-40"
                >
                   <div className="relative rounded-2xl overflow-hidden mb-12 min-h-[100px] flex items-end">
                      <Image
                        src={categoryHeroImage(category.name)}
                        fill
                        className="object-cover opacity-50"
                        alt=""
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                      <div className="relative z-10 p-6 md:p-8 flex items-end gap-6 w-full">
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                          {category.name}
                        </h2>
                        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2 hidden sm:block">
                          The Lineup
                        </span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {category.items.map((product) => (
                        <ProductCard 
                          key={product._id} 
                          product={product} 
                          onSelect={(p) => {
                            setSelectedProduct(p);
                            setSelectedCategoryName(category.name);
                            setIsDetailModalOpen(true);
                          }}
                        />
                      ))}
                   </div>
                </div>
             ))}

             {productsByCategory?.length === 0 && (
               <div className="text-center py-40 bg-white/5 rounded-[40px] border border-white/5">
                  <div className="h-20 w-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
                     <Search size={32} className="text-gray-700" />
                  </div>
                  <p className="text-gray-500 text-xl font-black uppercase tracking-tight">No matchups found.</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-6 text-[#D4AF37] font-black uppercase tracking-widest hover:underline"
                  >
                    Reset Search
                  </button>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Floating Cart Button Mobile */}
      {items.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 h-16 w-16 gold-gradient rounded-full shadow-2xl flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all lg:hidden"
        >
          <div className="relative">
            <ShoppingBag size={28} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-black">
              {items.length}
            </span>
          </div>
        </button>
      )}

      {/* Persistent Cart Indicator Desktop */}
      <div 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-40 hidden lg:flex items-center gap-6 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl cursor-pointer hover:bg-black transition-all group"
      >
         <div className="flex items-center gap-3 px-4 border-r border-white/10">
            <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Items</p>
            <p className="text-white font-black text-xl leading-none">{items.length}</p>
         </div>
         <div className="flex items-center gap-3 px-4">
            <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Total</p>
            <p className="text-[#D4AF37] font-black text-xl leading-none">
              ${useCart.getState().getTotal().toFixed(2)}
            </p>
         </div>
         <div className="h-12 w-12 gold-gradient rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
            <ShoppingBag size={20} />
         </div>
      </div>

      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal 
        product={selectedProduct} 
        categoryName={selectedCategoryName}
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </main>
  );
}
