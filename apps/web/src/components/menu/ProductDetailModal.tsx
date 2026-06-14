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
          <div className="ob-menu-modal-backdrop fixed inset-0 bg-white/90 backdrop-blur-sm" />
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
              <Dialog.Panel className="ob-menu-modal-panel w-full max-w-5xl transform overflow-hidden bg-white text-[#05070B] sm:rounded-[40px] shadow-2xl transition-all flex flex-col md:flex-row max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[min(90vh,880px)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="ob-menu-modal-close absolute top-6 right-6 z-50 h-10 w-10 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center text-[#05070B] border border-[#05070B]/15"
                >
                  <X size={20} />
                </button>

                <div
                  className={`ob-menu-modal-image w-full md:w-[42%] relative bg-white flex items-center justify-center shrink-0 ${imageBoxClass} md:max-h-none md:h-auto md:min-h-[320px]`}
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
                  <div className="ob-menu-modal-image-gradient absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-transparent md:bg-gradient-to-r md:from-white md:via-white/35 md:to-transparent pointer-events-none" />
                </div>

                <div className="w-full md:w-[58%] flex flex-col overflow-hidden min-h-0">
                  <div className="p-6 md:p-10 overflow-y-auto flex-1 no-scrollbar">
                    <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                      Menu Item
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-[#05070B] uppercase tracking-tight mb-4">
                      {product.name}
                    </h2>
                    <p className="text-[#D4AF37] text-2xl md:text-3xl font-black mb-6">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.description && (
                      <p className="text-[#05070B]/65 text-sm font-medium leading-relaxed mb-8">
                        {product.description}
                      </p>
                    )}

                    {product.disclaimer && (
                      <div className="ob-menu-modal-note bg-[#05070B]/5 border border-[#05070B]/10 rounded-xl p-4 flex gap-3 mb-8">
                        <Info className="h-5 w-5 text-[#D4AF37] shrink-0" />
                        <p className="text-[10px] text-[#05070B]/65 font-bold uppercase tracking-widest leading-relaxed">
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
                                  className="ob-menu-modal-option rounded-lg border border-[#05070B]/10 bg-[#05070B]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#05070B]/70"
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

                  <div className="ob-menu-modal-footer p-6 md:p-8 border-t border-[#05070B]/10 bg-white shrink-0">
                    <button
                      type="button"
                      onClick={onClose}
                      className="ob-menu-modal-button w-full py-4 rounded-2xl bg-white border border-[#05070B] text-[#05070B] font-black uppercase tracking-widest text-sm hover:bg-[#05070B] hover:text-white transition-all"
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
