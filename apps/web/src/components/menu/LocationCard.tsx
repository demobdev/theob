"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { OB_ADDRESS } from "@/lib/storeLocation";

type LocationCardProps = {
  onChange?: () => void;
  className?: string;
};

/** Store pickup card with static map background */
export default function LocationCard({ onChange, className = "" }: LocationCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl min-h-[120px] ${className}`}
    >
      <Image
        src="/images/location-map-greenville.jpg"
        alt="Map showing The Owner's Box on Woodruff Rd, Greenville"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 480px"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
        <div className="h-9 w-9 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg border-2 border-black/30">
          <MapPin size={18} className="text-black" strokeWidth={2.5} />
        </div>
      </div>
      <div className="relative z-10 flex items-start gap-3 p-5 pl-16">
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase tracking-tight text-sm text-white">
            {OB_ADDRESS.name}
          </p>
          <p className="text-gray-300 text-xs font-medium leading-relaxed mt-1">
            {OB_ADDRESS.line1}
            <br />
            {OB_ADDRESS.city}, {OB_ADDRESS.state} {OB_ADDRESS.zip}
          </p>
        </div>
        {onChange && (
          <button
            type="button"
            onClick={onChange}
            className="shrink-0 bg-black text-[#D4AF37] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1A1A1A] transition-all border border-[#D4AF37]/30"
          >
            Change
          </button>
        )}
      </div>
    </div>
  );
}
