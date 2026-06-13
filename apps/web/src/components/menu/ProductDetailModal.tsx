"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Info } from "lucide-react";
import Image from "next/image";
import { Doc } from "../../../../../convex/_generated/dataModel";
import {
  resolveProductImageSrc,
  productImageAspect,
} from "@/lib/productImage";
interface Props {
  product: Doc<"products"> | null;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  categoryName,
}: Props) {
  if (!product) return null;

  const imageSrc = resolveProductImageSrc(product.image);
  const aspect = productImageAspect(product.image, categoryName);
  const imageBoxClass =
    aspect === "square"
      ? "aspect-square max-h-[min(42vh,420px)]"
      : "aspect-[4/5] max-h-[min(52vh,520px)]";
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden bg-[#0A0A0A] sm:rounded-[40px] shadow-2xl transition-all flex flex-col md:flex-row max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[min(90vh,880px)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-6 right-6 z-50 h-10 w-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
                >
                  <X size={20} />
                </button>

                <div
                  className={`w-full md:w-[42%] relative bg-black flex items-center justify-center shrink-0 ${imageBoxClass} md:max-h-none md:h-auto md:min-h-[320px]`}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      fill
                      className="object-cover object-center"
                      alt={product.name}
                      sizes="(max-width: 768px) 100vw, 42vw"
                      unoptimized={
                        imageSrc.includes("convex.cloud") ||
                        imageSrc.includes("convex.site")
                      }
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (!t.src.endsWith("/loading-icon.png")) {
                          t.src = "/loading-icon.png";
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full p-12">
                      <Image
                        src="/loading-icon.png"
                        width={120}
                        height={120}
                        alt=""
                        className="opacity-40"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0A0A0A] md:via-[#0A0A0A]/40 md:to-transparent pointer-events-none" />
                </div>

                <div className="w-full md:w-[58%] flex flex-col overflow-hidden min-h-0">
                  <div className="p-6 md:p-10 overflow-y-auto flex-1 no-scrollbar">
                    <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                      Menu Item
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                      {product.name}
                    </h2>
                    <p className="text-[#D4AF37] text-2xl md:text-3xl font-black mb-6">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.description && (
                      <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                        {product.description}
                      </p>
                    )}

                    {product.disclaimer && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 mb-8">
                        <Info className="h-5 w-5 text-[#D4AF37] shrink-0" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                          {product.disclaimer}
                        </p>
                      </div>
                    )}

                    {product.modifiers && product.modifiers.length > 0 && (
                      <div className="space-y-5 mb-8">
                        {product.modifiers.map((modifier) => (
                          <div key={modifier.name}>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
                              {modifier.name}
                              {modifier.required ? "" : " (optional)"}
                            </p>
                            <ul className="flex flex-wrap gap-2">
                              {modifier.options.map((option) => (
                                <li
                                  key={option.name}
                                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-300"
                                >
                                  {option.name}
                                  {option.priceExtra > 0
                                    ? ` +$${option.priceExtra.toFixed(2)}`
                                    : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8 border-t border-white/10 bg-black shrink-0">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
