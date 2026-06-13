"use client";

import React, { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import { MapPin, Phone, Clock, Navigation, Mail, LocateFixed } from "lucide-react";
import dynamic from "next/dynamic";
import {
  OB_COORDS,
  OB_ADDRESS,
  OB_MAP_ZOOM,
  haversineMiles,
  formatDistanceAndDrive,
} from "@/lib/storeLocation";
import { getHeartlandOrderUrl } from "@/lib/orderLinks";
import DoorDashButton from "@/components/common/DoorDashButton";
import { ExternalLink } from "lucide-react";

const LocationMap = dynamic(() => import("@/components/locations/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#121212] animate-pulse rounded-2xl flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
      Loading Map...
    </div>
  ),
});

const OB_LOCATION: [number, number] = [OB_COORDS.lat, OB_COORDS.lng];
const SUPPORT_EMAIL = "support@ownersboxgvl.com";

function geoErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location access was denied. Enable location in your browser settings, or use Directions below.";
    case 2:
      return "Location unavailable right now. Try again or use Directions below.";
    case 3:
      return "Location request timed out. Try again.";
    default:
      return "Unable to retrieve your location.";
  }
}

function buildDirectionsUrl(userLocation: [number, number] | null): string {
  const dest = `${OB_COORDS.lat},${OB_COORDS.lng}`;
  if (userLocation) {
    const origin = `${userLocation[0]},${userLocation[1]}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

export default function LocationsPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [distanceLabel, setDistanceLabel] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const orderUrl = getHeartlandOrderUrl();

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    if (!window.isSecureContext) {
      setGeoError(
        "Location requires HTTPS. Open this site over a secure connection, or use Directions below.",
      );
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(coords);
        const miles = haversineMiles(
          coords[0],
          coords[1],
          OB_COORDS.lat,
          OB_COORDS.lng,
        );
        setDistanceLabel(formatDistanceAndDrive(miles));
        setGeoLoading(false);
      },
      (error) => {
        setGeoError(geoErrorMessage(error.code));
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 120000 },
    );
  }, []);

  return (
    <main className="bg-[#0A0A0A] min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div>
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
              Find Us
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
              Location & Contact
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              Greenville&apos;s premier sports bar experience. One address, full menu, and game-day energy on Woodruff Road.
            </p>
          </div>

          <div className="space-y-6">
            <div className="premium-card p-8 border-[#D4AF37]/30 bg-[#D4AF37]/5 relative group">
              <div className="absolute top-6 right-6 h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black">
                <MapPin className="h-6 w-6" />
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                {OB_ADDRESS.name}
              </h3>
              <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">
                Greenville, SC
              </p>

              {distanceLabel && (
                <p className="text-white text-xs font-black uppercase tracking-widest mb-4 bg-black/30 rounded-lg px-3 py-2 inline-block">
                  {distanceLabel}
                </p>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                  <div className="text-gray-300 text-sm font-medium">
                    {OB_ADDRESS.line1}
                    <br />
                    {OB_ADDRESS.city}, {OB_ADDRESS.state} {OB_ADDRESS.zip}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500 shrink-0" />
                  <a
                    href={`tel:${OB_ADDRESS.phone.replace(/\D/g, "")}`}
                    className="text-gray-300 text-sm font-medium hover:text-[#D4AF37]"
                  >
                    {OB_ADDRESS.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                  <div className="text-gray-300 text-sm font-medium">
                    <span className="block mb-1">Sun – Thu: 11AM – 11PM</span>
                    <span className="block">Fri – Sat: 11AM – 1AM</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={requestLocation}
                disabled={geoLoading}
                className="w-full mb-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LocateFixed className="h-3.5 w-3.5" />
                {geoLoading ? "Locating…" : "Use My Location"}
              </button>

              <div className="flex flex-col gap-3">
                <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button
                    type="button"
                    className="w-full py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs gold-glow hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                  >
                    Order Takeout
                    <ExternalLink size={12} />
                  </button>
                </a>
                <DoorDashButton fullWidth />
                <a
                  href={buildDirectionsUrl(userLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button
                    type="button"
                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation className="h-3 w-3" />
                    Directions
                  </button>
                </a>
              </div>
            </div>

            {geoError && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200/90 text-xs font-bold uppercase tracking-widest leading-relaxed">
                {geoError}
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="mt-3 block text-[#D4AF37] hover:underline normal-case tracking-normal font-black"
                >
                  {geoLoading ? "Locating…" : "Try again"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-2/3 min-h-[500px] lg:min-h-[560px] relative">
          <LocationMap
            location={OB_LOCATION}
            userLocation={userLocation}
            zoom={OB_MAP_ZOOM}
          />
        </div>
      </section>

      <section id="contact" className="border-t border-white/5 bg-black/40 py-20 scroll-mt-28">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-[#D4AF37]" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              Contact Us
            </h2>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
            Questions about your order, private events, or hosting a group? Reach out — we&apos;ll get back to you during business hours.
          </p>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
              const subject = encodeURIComponent(`Contact from ${name}`);
              const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
              window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
            }}
          >
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="How can we help?"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs gold-glow"
            >
              Send Message
            </button>
          </form>
          <p className="text-gray-600 text-[10px] font-medium mt-6 uppercase tracking-widest">
            Opens your email app — we reply during business hours · {SUPPORT_EMAIL}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
