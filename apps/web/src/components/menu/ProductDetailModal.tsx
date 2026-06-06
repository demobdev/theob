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
import HeartlandOrderLink from "@/components/common/HeartlandOrderLink";

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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden bg-[#0A0A0A] sm:rounded-[40px] shadow-2xl transition-all flex flex-col max-h-[calc(100vh-5rem)] sm:max-h-[min(90vh,720px)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-6 right-6 z-50 h-10 w-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
                >
                  <X size={20} />
                </button>

                <div className={`w-full relative bg-black shrink-0 ${imageBoxClass}`}>
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      fill
                      className="object-cover object-center"
                      alt={product.name}
                      sizes="100vw"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-6 md:p-10 overflow-y-auto flex-1">
                  <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                    Menu Preview
                  </span>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                      {product.name}
                    </h2>
                    <p className="text-[#D4AF37] font-black text-xl shrink-0">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                    {product.description}
                  </p>

                  {product.disclaimer && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 mb-8">
                      <Info className="h-5 w-5 text-[#D4AF37] shrink-0" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        {product.disclaimer}
                      </p>
                    </div>
                  )}

                  {product.modifiers && product.modifiers.length > 0 && (
                    <div className="space-y-6 mb-8">
                      {product.modifiers.map((mod) => (
                        <div key={mod.name}>
                          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-3">
                            {mod.name}
                          </h4>
                          <ul className="flex flex-wrap gap-2">
                            {mod.options.map((opt) => (
                              <li
                                key={opt.name}
                                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold"
                              >
                                {opt.name}
                                {opt.priceExtra > 0 && (
                                  <span className="text-[#D4AF37] ml-1">
                                    +${opt.priceExtra.toFixed(2)}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-500 text-xs font-medium mb-6">
                    Customizations and ordering are available online — curbside pickup, dine-in, and delivery included.
                  </p>

                  <HeartlandOrderLink className="block w-full">
                    <span className="flex w-full justify-center py-5 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-sm gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                      Order Online
                    </span>
                  </HeartlandOrderLink>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
