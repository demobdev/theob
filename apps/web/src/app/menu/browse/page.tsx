"use client";

/**
 * Interactive product menu — preserved for a future launch once all item photos are ready.
 * Not linked from public navigation; use /menu for the PDF menu.
 */

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Search, ChevronRight, Menu as MenuIcon } from "lucide-react";
import ProductDetailModal from "@/components/menu/ProductDetailModal";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { categoryHeroImage } from "@/lib/categoryHero";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { resolveProductImageSrc } from "@/lib/productImage";

type ProductDoc = Doc<"products">;

function MenuProductCard({
  product,
  onSelect,
}: {
  product: ProductDoc;
  onSelect: (product: ProductDoc) => void;
}) {
  const imageSrc = resolveProductImageSrc(product.image);

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group grid overflow-hidden rounded-[24px] border-2 border-[#05070B]/10 bg-white text-left shadow-[0_12px_0_rgba(5,7,11,0.06)] transition-transform hover:-translate-y-1 md:grid-cols-[190px_1fr]"
    >
      <div className="relative aspect-[4/3] bg-[#171713] md:aspect-auto md:min-h-[210px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 240px"
            unoptimized={imageSrc.includes("convex.cloud") || imageSrc.includes("convex.site")}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith("/ob-icon.png")) {
                target.src = "/ob-icon.png";
              }
            }}
          />
        ) : (
          <Image src="/ob-icon.png" fill className="object-contain p-10" alt={product.name} sizes="220px" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full border border-white bg-white px-3 py-1 text-[8px] font-black uppercase tracking-widest text-[#05070B]">
            Popular
          </span>
        )}
      </div>

      <div className="flex min-h-[210px] flex-col justify-between p-5">
        <div>
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="font-montserrat text-2xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#05070B] group-hover:text-black">
              {product.name}
            </h3>
            <span className="shrink-0 rounded-full bg-[#05070B] px-3 py-1 text-xs font-black text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>
          {product.description && (
            <p className="line-clamp-3 text-sm font-semibold leading-relaxed text-[#05070B]/65">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#05070B]/10 pt-4">
          <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#05070B]/65">
            View Details
          </span>
          <ChevronRight className="h-4 w-4 text-[#05070B]" />
        </div>
      </div>
    </button>
  );
}

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
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="bg-white px-4 pb-10 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-10">
          <div className="relative min-h-[430px] overflow-hidden rounded-[24px] border-2 border-[#171713]/10 sm:min-h-[560px] lg:min-h-[620px]">
            <Image
              src="/images/food/official/featured-pizza.png"
              fill
              className="object-cover"
              alt="The Owner's Box featured pizza"
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <p className="mb-4 w-fit rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
                Scratch-made favorites
              </p>
              <h1 className="font-montserrat text-[clamp(4rem,13vw,12rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#F2EAD4]">
                Good Eats
              </h1>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-[#F2EAD4]/80 sm:text-base">
                Browse the lineup, pick your category, and tap a dish for details. Order links stay simple.
              </p>
            </div>
          </div>
        </div>

      </section>

      {categories && categories.length > 0 && (
        <div className="sticky top-0 z-40 border-y border-[#05070B]/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="hidden shrink-0 text-[9px] font-black uppercase tracking-[0.24em] text-[#05070B]/65 sm:inline">
                Jump to
              </span>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => scrollToCategory(cat._id)}
                  className={`shrink-0 rounded-full border-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat._id
                      ? "border-[#05070B] bg-[#05070B] text-white"
                      : "border-[#05070B]/20 text-[#05070B] hover:border-[#05070B] hover:bg-[#05070B] hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="ob-canvas bg-white px-4 py-12 text-[#05070B] sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 rounded-[28px] bg-white p-4 shadow-[0_28px_90px_rgba(0,0,0,0.24)] md:p-8 lg:flex-row lg:gap-8">
          <aside className="w-full lg:w-72 shrink-0">
             <div className="sticky top-24 space-y-6">
                <div className="hidden rounded-[24px] border-2 border-[#05070B]/10 bg-white p-5 lg:block">
                   <h3 className="mb-5 flex items-center gap-2 px-1 text-xs font-black uppercase tracking-widest text-[#05070B]">
                     <MenuIcon size={14} className="text-[#05070B]/65" />
                     Categories
                   </h3>
                   <div className="flex flex-col gap-1">
                        {categories?.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => scrollToCategory(cat._id)}
                            className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all ${
                              activeCategory === cat._id
                                ? "bg-[#05070B] text-white"
                                : "text-[#05070B]/65 hover:bg-[#05070B] hover:text-white"
                            }`}
                          >
                            {cat.name}
                            <ChevronRight size={12} className={activeCategory === cat._id ? "opacity-100" : "opacity-0"} />
                          </button>
                        ))}
                   </div>
                </div>

                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#05070B]/65" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#05070B] bg-white py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-[#05070B] transition-all placeholder:text-[#05070B]/40 focus:border-[#05070B] focus:outline-none"
                  />
                </div>
             </div>
          </aside>

          <div className="flex-1 space-y-20">
             {productsByCategory?.map((category) => (
                <div
                  key={category._id}
                  ref={el => { categoryRefs.current[category._id] = el; }}
                  className="scroll-mt-44"
                >
                   <div className="relative mb-8 flex min-h-[170px] items-end overflow-hidden rounded-[24px] border-2 border-[#171713]/10">
                      <Image
                        src={categoryHeroImage(category.name)}
                        fill
                        className="object-cover"
                        alt=""
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                      <div className="relative z-10 flex w-full items-end gap-6 p-6 md:p-8">
                        <h2 className="font-montserrat text-4xl font-black uppercase tracking-[-0.06em] text-[#F2EAD4] md:text-5xl lg:text-6xl">
                          {category.name}
                        </h2>
                        <span className="mb-2 hidden text-[10px] font-black uppercase tracking-[0.3em] text-white/70 sm:block">
                          The Lineup
                        </span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
                      {category.items.map((product) => (
                        <MenuProductCard
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
               <div className="rounded-[28px] border-2 border-[#05070B]/10 bg-white py-32 text-center">
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#05070B]">
                     <Search size={32} className="text-white" />
                  </div>
                  <p className="text-xl font-black uppercase tracking-tight text-[#05070B]">No menu items found.</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-6 font-black uppercase tracking-widest text-[#05070B] hover:underline"
                  >
                    Reset Search
                  </button>
               </div>
             )}
          </div>
        </div>
      </section>

      <AltHomeFooter />

      <ProductDetailModal
        product={selectedProduct}
        categoryName={selectedCategoryName}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </main>
  );
}
