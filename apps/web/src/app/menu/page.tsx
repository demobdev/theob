"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Search, Download, ChevronRight, Menu as MenuIcon } from "lucide-react";
import ProductCard from "@/components/menu/ProductCard";
import ProductDetailModal from "@/components/menu/ProductDetailModal";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { categoryHeroImage } from "@/lib/categoryHero";

export default function MenuPage() {
  const categories = useQuery(api.products.getCategories);
  const products = useQuery(api.products.getAllProducts);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Doc<"products"> | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories, activeCategory]);

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

      {/* Compact hero — atmosphere + food mosaic */}
      <section className="relative border-b border-[#D4AF37]/15 overflow-hidden mb-6 md:mb-8">
        <div className="grid grid-cols-12 h-[160px] sm:h-[200px] md:h-[240px]">
          <div className="col-span-4 md:col-span-3 relative">
            <Image
              src="/hero.png"
              fill
              className="object-cover"
              alt="The Owner's Box dining room"
              priority
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/80" />
          </div>
          <div className="col-span-8 md:col-span-9 grid grid-cols-3">
            {[
              { src: "/images/menu/jumbo_wings.png", alt: "Jumbo wings" },
              { src: "/images/menu/rib_eye.png", alt: "Rib eye steak" },
              { src: "/images/menu/meat_lover_pizza.png", alt: "Meat lover pizza" },
            ].map((photo) => (
              <div key={photo.src} className="relative overflow-hidden">
                <Image
                  src={photo.src}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  alt={photo.alt}
                  sizes="(max-width: 768px) 22vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container mx-auto px-4 pb-5 md:pb-6 pt-12 md:pt-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-5">
              <div className="min-w-0">
                <div className="h-px w-12 bg-[#D4AF37] mb-2.5" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                  Menu Board
                </h1>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] mt-2">
                  Display only · Order from the header
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex items-center gap-2">
          <a
            href="/menu.pdf"
            download
            className="flex items-center gap-2 px-3 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white transition-all"
          >
            <Download size={14} className="text-[#D4AF37]" />
            <span className="font-black uppercase tracking-widest text-[9px] hidden sm:inline">PDF</span>
          </a>
        </div>
      </section>

      {/* Sticky category nav — no duplicate order CTAs (use header) */}
      {categories && categories.length > 0 && (
        <div className="sticky top-20 z-40 border-b border-white/5 bg-[#0A0A0A]/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="shrink-0 text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] hidden sm:inline">
                Jump to
              </span>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => scrollToCategory(cat._id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                    activeCategory === cat._id
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "text-white/60 border-white/10 hover:border-[#D4AF37]/40 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <section className="noise-overlay pb-20">
        <div className="container mx-auto px-4 pt-4 md:pt-6 flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-30">

          {/* Sidebar — search (+ categories on desktop only) */}
          <aside className="w-full lg:w-72 shrink-0">
             <div className="sticky top-36 space-y-6">
                <div className="hidden lg:block premium-card p-6 border-white/10 bg-black/80 backdrop-blur-xl">
                   <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2 px-1">
                     <MenuIcon size={14} className="text-[#D4AF37]" />
                     Categories
                   </h3>
                   <div className="flex flex-col gap-1">
                        {categories?.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => scrollToCategory(cat._id)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                              activeCategory === cat._id
                                ? "bg-[#D4AF37] text-black"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {cat.name}
                            <ChevronRight size={12} className={activeCategory === cat._id ? "opacity-100" : "opacity-0"} />
                          </button>
                        ))}
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
             </div>
          </aside>

          {/* Product Feed */}
          <div className="flex-1 space-y-24">
             {productsByCategory?.map((category) => (
                <div
                  key={category._id}
                  ref={el => { categoryRefs.current[category._id] = el; }}
                  className="scroll-mt-48"
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
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">
                          {category.name}
                        </h2>
                        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2 hidden sm:block">
                          The Lineup
                        </span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-10">
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

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        categoryName={selectedCategoryName}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </main>
  );
}
