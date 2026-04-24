"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, getTotal, fulfillment } = useCart();

  const total = getTotal();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[150]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#0A0A0A] border-l border-white/10 shadow-2xl noise-overlay">
                    <div className="flex-1 overflow-y-auto px-6 py-10 no-scrollbar relative z-10">
                      <div className="flex items-start justify-between mb-12">
                        <div>
                          <Dialog.Title className="text-3xl font-black text-white uppercase tracking-tight">
                            Your Order
                          </Dialog.Title>
                          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                             <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                             {fulfillment ? fulfillment.replace("-", " ") : "Select Fulfillment"}
                          </p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                          <X size={28} />
                        </button>
                      </div>

                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-gray-600" />
                          </div>
                          <p className="text-white font-black uppercase tracking-tight text-xl mb-2">Your cart is empty</p>
                          <p className="text-gray-500 text-sm font-medium mb-10 max-w-[200px]">Looks like you haven't added anything to your lineup yet.</p>
                          <button 
                            onClick={onClose}
                            className="px-8 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs"
                          >
                            Browse the Menu
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {items.map((item) => (
                            <div key={item.id} className="flex gap-6 group">
                              <div className="h-20 w-20 relative rounded-xl overflow-hidden shrink-0 border border-white/5">
                                 {item.image && (
                                   <Image 
                                      src={item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `/images/food/${item.image}.png`}
                                      fill
                                      className="object-cover"
                                      alt={item.name}
                                   />
                                 )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="text-white font-black uppercase tracking-tight text-sm">
                                    {item.name}
                                  </h4>
                                  <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-600 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div className="space-y-1 mb-4">
                                  {item.modifiers.map(mod => (
                                    <p key={mod.name} className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                      {mod.name}: {mod.options.map(o => o.name).join(", ")}
                                    </p>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-4 bg-white/5 rounded-lg p-1 px-3">
                                     <button 
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="text-gray-400 hover:text-white"
                                     >
                                       -
                                     </button>
                                     <span className="text-white font-black text-xs">{item.quantity}</span>
                                     <button 
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="text-gray-400 hover:text-white"
                                     >
                                       +
                                     </button>
                                  </div>
                                  <p className="text-[#D4AF37] font-black text-sm">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="pt-8 mt-12 border-t border-white/5">
                             <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 mb-8">
                                <div className="h-10 w-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                   <span className="font-black text-xs">$5</span>
                                </div>
                                <div>
                                   <p className="text-white font-black uppercase tracking-tight text-xs">Unlock $5 OFF</p>
                                   <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">Join our roster to redeem.</p>
                                </div>
                                <button className="ml-auto text-[#D4AF37] text-[10px] font-black uppercase tracking-widest hover:underline">
                                  Sign Up
                                </button>
                             </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-white/10 bg-black p-8 relative z-20">
                        <div className="space-y-4 mb-8">
                           <div className="flex justify-between items-center text-gray-500">
                             <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                             <span className="text-sm font-bold">${total.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between items-center text-gray-500">
                             <span className="text-[10px] font-black uppercase tracking-widest">Tax</span>
                             <span className="text-sm font-bold">${(total * 0.06).toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between items-center pt-4 border-t border-white/5">
                             <span className="text-white font-black uppercase tracking-widest text-lg">Total</span>
                             <span className="text-[#D4AF37] text-2xl font-black">${(total * 1.06).toFixed(2)}</span>
                           </div>
                        </div>

                        <Link href="/checkout" className="block">
                          <button className="w-full py-5 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-md gold-glow flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Checkout
                            <ArrowRight size={20} />
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
