"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { resolveProductImageSrc } from "@/lib/productImage";

interface Props {
  product: Doc<"products">;
  onSelect: (product: Doc<"products">) => void;
}

export default function ProductCard({ product, onSelect }: Props) {
  const imageSrc = resolveProductImageSrc(product.image);

  return (
    <div
      className="premium-card p-6 flex flex-col gap-4 group cursor-pointer hover:bg-[#111] transition-all"
      onClick={() => onSelect(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(product);
      }}
      role="button"
      tabIndex={0}
    >
      {imageSrc && (
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-2 bg-[#0A0A0A]">
          <Image
            src={imageSrc}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 320px"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (!t.src.endsWith("/loading-icon.png")) {
                t.src = "/loading-icon.png";
              }
            }}
          />
          {product.isFeatured && (
            <div className="absolute top-4 left-4 gold-gradient px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-black">
              Popular
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors leading-tight">
          {product.name}
        </h3>
        <span className="text-[#D4AF37] font-bold text-sm">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2">
        {product.description}
      </p>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
          View Customizations
        </span>
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
          <Plus size={16} />
        </div>
      </div>
    </div>
  );
}
