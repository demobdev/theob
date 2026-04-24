"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Store, Car, Truck, X, MapPin, Clock, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function LocationFulfillmentModal() {
  const { setFulfillment, fulfillment, isFulfillmentModalOpen, setFulfillmentModalOpen } = useCart();
  const [tempFulfillment, setTempFulfillment] = useState<"in-store" | "curbside" | "delivery">(fulfillment || "in-store");
  const [timeType, setTimeType] = useState<"today" | "schedule">("today");
  
  // Curbside Fields
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  
  // Delivery Fields
  const [address, setAddress] = useState("");
  const [apt, setApt] = useState("");

  const options = [
    { id: "in-store", label: "In-Store", icon: Store },
    { id: "curbside", label: "Curbside", icon: Car },
    { id: "delivery", label: "Delivery", icon: Truck },
  ] as const;

  const handleUpdate = () => {
    setFulfillment(tempFulfillment);
    // In a real app, we'd also save the vehicle/address details to the cart state
    setFulfillmentModalOpen(false);
  };

  return (
    <Transition show={isFulfillmentModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={() => setFulfillmentModalOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[32px] bg-white text-black p-0 shadow-2xl transition-all">
                
                {/* Close Button */}
                <button 
                  onClick={() => setFulfillmentModalOpen(false)} 
                  className="absolute top-6 right-6 z-50 text-gray-400 hover:text-black transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="p-8">
                   {/* Fulfillment Tabs */}
                   <div className="flex border border-gray-200 rounded-2xl overflow-hidden mb-8">
                      {options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setTempFulfillment(opt.id)}
                          className={`flex-1 flex flex-col items-center justify-center py-4 gap-2 transition-all ${
                            tempFulfillment === opt.id 
                              ? "bg-[#CC2027] text-white" 
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <opt.icon size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                        </button>
                      ))}
                   </div>

                   {/* Conditional Content */}
                   {tempFulfillment === "delivery" ? (
                      <div className="space-y-4 mb-8">
                         <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Address</label>
                            <input 
                              type="text" 
                              placeholder="Street Address" 
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-gray-300"
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Apt / Suite / Floor</label>
                            <input 
                              type="text" 
                              placeholder="Optional" 
                              value={apt}
                              onChange={(e) => setApt(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-gray-300"
                            />
                         </div>
                      </div>
                   ) : (
                      <div className="bg-gray-50 rounded-[24px] p-6 mb-8 relative overflow-hidden group">
                         <div className="flex items-start gap-4 relative z-10">
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#CC2027] shadow-sm">
                               <MapPin size={20} />
                            </div>
                            <div>
                               <p className="font-black uppercase tracking-tight text-sm">The Owner's Box</p>
                               <p className="text-gray-500 text-xs font-medium leading-relaxed">
                                  1757 Woodruff Rd,<br />
                                  Greenville, SC 29607
                               </p>
                            </div>
                            <button className="ml-auto bg-[#CC2027] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                               Change
                            </button>
                         </div>
                      </div>
                   )}

                   {/* Curbside Details */}
                   {tempFulfillment === "curbside" && (
                      <div className="mb-8">
                         <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
                           Help us get your food to you quickly by adding details below:
                         </p>
                         <div className="grid grid-cols-3 gap-3">
                            <input 
                              type="text" 
                              placeholder="Make" 
                              value={vehicleMake}
                              onChange={(e) => setVehicleMake(e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-gray-300"
                            />
                            <input 
                              type="text" 
                              placeholder="Model" 
                              value={vehicleModel}
                              onChange={(e) => setVehicleModel(e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-gray-300"
                            />
                            <input 
                              type="text" 
                              placeholder="Color" 
                              value={vehicleColor}
                              onChange={(e) => setVehicleColor(e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-xs font-bold focus:outline-none focus:border-gray-300"
                            />
                         </div>
                      </div>
                   )}

                   {/* Time Selection */}
                   <div className="space-y-6">
                      <div className="flex gap-2">
                         <button 
                          onClick={() => setTimeType("today")}
                          className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                            timeType === "today" ? "bg-[#CC2027] border-[#CC2027] text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                         >
                           Today
                         </button>
                         <button 
                          onClick={() => setTimeType("schedule")}
                          className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                            timeType === "schedule" ? "bg-[#CC2027] border-[#CC2027] text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                         >
                           Schedule
                         </button>
                      </div>

                      <div>
                         <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                           {tempFulfillment.replace("-", " ")} Time
                         </label>
                         <div className="relative">
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest appearance-none focus:outline-none focus:border-gray-300 cursor-pointer">
                               <option>ASAP (15-20 mins)</option>
                               <option>10:30 am - 10:45 am</option>
                               <option>11:00 am - 11:15 am</option>
                            </select>
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 bg-gray-50 border-t border-gray-100">
                   <button 
                    onClick={handleUpdate}
                    className="w-full py-5 bg-[#CC2027] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
                   >
                     Update Order
                   </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
