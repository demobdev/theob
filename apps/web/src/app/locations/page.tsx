"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import { MapPin, Phone, Clock, Navigation, ExternalLink, Globe } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import Map component to avoid SSR issues with Leaflet
const LocationMap = dynamic(() => import("@/components/locations/LocationMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#121212] animate-pulse rounded-2xl flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">Loading Map...</div>,
});

const OB_LOCATION: [number, number] = [34.8239, -82.3168];

export default function LocationsPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setGeoError("Unable to retrieve your location.");
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <main className="bg-[#0A0A0A] min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: Location Details */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div>
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
              Find Us
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
              Locations
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              Greenville’s premier sports bar experience. Whether you’re here for the game or the craft pizza, we’ve got your seat ready.
            </p>
          </div>

          <div className="space-y-6">
            <div className="premium-card p-8 border-[#D4AF37]/30 bg-[#D4AF37]/5 relative group">
                <div className="absolute top-6 right-6 h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black">
                    <MapPin className="h-6 w-6" />
                </div>
                
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">The Owner's Box</h3>
                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">Greenville, SC</p>
                
                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                        <div className="text-gray-300 text-sm font-medium">
                            1757 Woodruff Rd,<br />
                            Greenville, SC 29607
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500 shrink-0" />
                        <div className="text-gray-300 text-sm font-medium">(864) 555-0123</div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                        <div className="text-gray-300 text-sm font-medium">
                            <span className="block mb-1">Sun - Thu: 11AM - 11PM</span>
                            <span className="block">Fri - Sat: 11AM - 1AM</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/menu" className="flex-1">
                        <button className="w-full py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs gold-glow hover:scale-105 transition-all">
                            Order Now
                        </button>
                    </Link>
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${OB_LOCATION[0]},${OB_LOCATION[1]}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                    >
                        <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Navigation className="h-3 w-3" />
                            Directions
                        </button>
                    </a>
                </div>
            </div>

            {geoError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-widest">
                <Info size={16} />
                {geoError}
              </div>
            )}
          </div>

          <div className="mt-auto p-6 rounded-2xl border border-white/5 bg-white/5">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4">Coming Soon</h4>
            <p className="text-gray-500 text-sm font-medium mb-2 italic">
              "We're currently scouting new locations to bring The Owner's Box experience to more neighborhoods in the Upstate."
            </p>
          </div>
        </div>

        {/* RIGHT: Map Area */}
        <div className="w-full lg:w-2/3 min-h-[500px] lg:min-h-0 relative">
          <LocationMap location={OB_LOCATION} userLocation={userLocation} />
          
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-80 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl z-10">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-white text-[10px] font-black uppercase tracking-widest">Live Status</h5>
              <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Open Now
              </span>
            </div>
            <p className="text-gray-400 text-[10px] font-medium">
              Current wait time: <span className="text-white font-bold">~15 mins</span> for a table. Prime seating available for NFL Sunday Ticket.
            </p>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}

function Info({ size }: { size: number }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}
