"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Minus, Plus, Info } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Doc } from "../../../../../convex/_generated/dataModel";

interface Props {
  product: Doc<"products"> | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Initialize selected modifiers when product changes
  useEffect(() => {
    if (product?.modifiers) {
      const initialMods = product.modifiers.map(mod => ({
        name: mod.name,
        options: mod.options.filter(opt => opt.defaultSelected) || []
      }));
      setSelectedModifiers(initialMods);
    } else {
      setSelectedModifiers([]);
    }
    setQuantity(1);
    setSpecialInstructions("");
  }, [product]);

  if (!product) return null;

  const handleToggleOption = (modName: string, option: any, type: string) => {
    setSelectedModifiers(prev => {
      const existingMod = prev.find(m => m.name === modName);
      if (type === "single_select") {
        return prev.map(m => m.name === modName ? { ...m, options: [option] } : m);
      } else {
        const modOptions = existingMod?.options || [];
        const isSelected = modOptions.some((o: any) => o.name === option.name);
        const newOptions = isSelected 
          ? modOptions.filter((o: any) => o.name !== option.name)
          : [...modOptions, option];
        return prev.map(m => m.name === modName ? { ...m, options: newOptions } : m);
      }
    });
  };

  const calculateTotalPrice = () => {
    const modPrice = selectedModifiers.reduce((acc, mod) => {
      return acc + mod.options.reduce((oAcc: number, opt: any) => oAcc + opt.priceExtra, 0);
    }, 0);
    return (product.price + modPrice) * quantity;
  };

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substring(7),
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      modifiers: selectedModifiers,
      specialInstructions
    });
    onClose();
  };

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
          <div className="flex min-h-full items-center justify-center p-0 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-[#0A0A0A] sm:rounded-[40px] shadow-2xl transition-all flex flex-col md:flex-row max-h-[100vh] md:max-h-[90vh]">
                
                {/* Close Button Mobile */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 z-50 h-10 w-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
                >
                  <X size={20} />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 relative h-64 md:h-auto bg-black">
                   {product.image && (
                     <Image 
                        src={product.image.startsWith("http") || product.image.startsWith("/") ? product.image : `/images/food/${product.image}.png`}
                        fill
                        className="object-cover opacity-80"
                        alt={product.name}
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Right: Details & Customization */}
                <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
                  <div className="p-8 md:p-12 overflow-y-auto flex-1 no-scrollbar">
                    <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                      Customizing Your Order
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                      {product.name}
                    </h2>
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

                    {/* Modifiers */}
                    <div className="space-y-10">
                      {product.modifiers?.map((mod) => (
                        <div key={mod.name}>
                          <div className="flex justify-between items-center mb-6">
                             <h4 className="text-white font-black uppercase tracking-widest text-xs">
                               {mod.name}
                             </h4>
                             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-gray-500 rounded">
                               {mod.required ? "Required" : "Optional"}
                             </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            {mod.options.map((opt) => {
                              const isSelected = selectedModifiers.find(m => m.name === mod.name)?.options.some((o: any) => o.name === opt.name);
                              return (
                                <button
                                  key={opt.name}
                                  onClick={() => handleToggleOption(mod.name, opt, mod.type)}
                                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    isSelected ? "bg-[#D4AF37]/10 border-[#D4AF37] text-white" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                     <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#D4AF37]" : "border-gray-600"}`}>
                                        {isSelected && <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />}
                                     </div>
                                     <span className="text-sm font-bold">{opt.name}</span>
                                  </div>
                                  {opt.priceExtra > 0 && (
                                    <span className="text-xs font-black text-[#D4AF37]">
                                      +${opt.priceExtra.toFixed(2)}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Special Instructions */}
                      <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">
                          Special Instructions
                        </h4>
                        <textarea
                          placeholder="e.g. Extra sauce on the side, no onions..."
                          className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white/20 transition-all h-24"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer / Add Button */}
                  <div className="p-8 border-t border-white/10 bg-black flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6 bg-white/5 rounded-xl p-2">
                         <button 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                         >
                           <Minus size={20} />
                         </button>
                         <span className="text-white font-black text-xl w-6 text-center">{quantity}</span>
                         <button 
                            onClick={() => setQuantity(q => q + 1)}
                            className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                         >
                           <Plus size={20} />
                         </button>
                       </div>
                       
                       <div className="text-right">
                          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Price</p>
                          <p className="text-white text-3xl font-black">${calculateTotalPrice().toFixed(2)}</p>
                       </div>
                    </div>

                    <button 
                      onClick={handleAddToCart}
                      className="w-full py-5 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-md gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Add to Order
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
