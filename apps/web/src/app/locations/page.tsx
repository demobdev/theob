"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ExternalLink,
  LocateFixed,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import dynamic from "next/dynamic";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import {
  OB_COORDS,
  OB_ADDRESS,
  OB_MAP_ZOOM,
  haversineMiles,
  formatDistanceAndDrive,
} from "@/lib/storeLocation";
import { getOrderPagePath } from "@/lib/orderLinks";
import { OB_GOOGLE_REVIEW_URL, OB_SUPPORT_EMAIL } from "@/lib/localSeo";
import DoorDashButton from "@/components/common/DoorDashButton";

const LocationMap = dynamic(() => import("@/components/locations/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center rounded-2xl bg-[#121212] text-xs font-bold uppercase tracking-widest text-gray-500">
      Loading map...
    </div>
  ),
});

const OB_LOCATION: [number, number] = [OB_COORDS.lat, OB_COORDS.lng];

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [distanceLabel, setDistanceLabel] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const orderUrl = getOrderPagePath();

  useEffect(() => {
    document.documentElement.classList.remove("ob-dark-mode");
  }, []);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );

    observer.observe(mapContainer);
    return () => observer.disconnect();
  }, []);

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
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="bg-white px-4 pb-10 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative min-h-[380px] overflow-hidden rounded-[24px] border-2 border-[#05070B]/10 sm:min-h-[440px]">
            <Image
              src="/sports-feature.jpg"
              alt="The Owner's Box sports bar and grill in Greenville SC on Woodruff Road"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1600px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/34 to-black/5" />
            <div className="absolute left-5 top-5 w-[min(400px,calc(100%-40px))] rounded-[24px] border border-white/20 bg-white p-5 text-[#05070B] shadow-2xl sm:left-8 sm:top-8 sm:p-7">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#05070B]/60">
                Visit · Contact
              </p>
              <h1 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-6xl">
                Come
                <br />
                See Us
              </h1>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-[#05070B]/68">
                {OB_ADDRESS.line1}, {OB_ADDRESS.city}, {OB_ADDRESS.state}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`tel:${OB_ADDRESS.phoneTel}`}
                  className="rounded-full border-2 border-[#05070B] bg-[#05070B] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white"
                >
                  {OB_ADDRESS.phone}
                </a>
                <a
                  href={buildDirectionsUrl(userLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-[#05070B] bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#05070B]"
                >
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 pb-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-[#05070B]/10 bg-[#101014] p-6 text-white sm:p-8">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
              Woodruff Road
            </p>
            <h2 className="font-montserrat text-3xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-4xl">
              {OB_ADDRESS.name}
            </h2>

            {distanceLabel ? (
              <p className="mt-4 inline-block rounded-full border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                {distanceLabel}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 text-sm font-semibold text-white/72">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white/45" />
                <p>
                  {OB_ADDRESS.line1}
                  <br />
                  {OB_ADDRESS.city}, {OB_ADDRESS.state} {OB_ADDRESS.zip}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-white/45" />
                <a href={`tel:${OB_ADDRESS.phoneTel}`} className="hover:text-white">
                  {OB_ADDRESS.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-white/45" />
                <a href={`mailto:${OB_SUPPORT_EMAIL}`} className="hover:text-white">
                  {OB_SUPPORT_EMAIL}
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={requestLocation}
              disabled={geoLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#05070B] disabled:opacity-50"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {geoLoading ? "Locating..." : "Use my location"}
            </button>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#05070B]"
              >
                Order takeout
                <ExternalLink size={12} />
              </a>
              <DoorDashButton fullWidth />
              <a
                href={buildDirectionsUrl(userLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#05070B] sm:col-span-2"
              >
                <Navigation className="h-3 w-3" />
                Get directions
              </a>
            </div>

            {geoError ? (
              <p className="mt-4 text-xs font-semibold leading-relaxed text-white/70">{geoError}</p>
            ) : null}
          </div>

          <div
            ref={mapContainerRef}
            className="min-h-[360px] overflow-hidden rounded-[28px] border border-[#05070B]/10 lg:min-h-[480px]"
          >
            {mapVisible ? (
              <LocationMap location={OB_LOCATION} userLocation={userLocation} zoom={OB_MAP_ZOOM} />
            ) : (
              <div className="flex h-full min-h-[360px] w-full items-center justify-center rounded-2xl bg-[#121212] text-xs font-bold uppercase tracking-widest text-gray-500 lg:min-h-[480px]">
                Map loads when in view
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="ob-canvas scroll-mt-28 bg-white px-4 pb-20 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] rounded-[28px] border border-[#05070B]/10 bg-white p-6 sm:p-8">
          <div className="mb-8 max-w-xl">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
              Contact
            </p>
            <h2 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-5xl">
              Send a message
            </h2>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#05070B]/65">
              Questions about orders, groups, or private events? Send us a note below.
            </p>
          </div>

          <form
            className="mx-auto grid max-w-xl gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
              const subject = encodeURIComponent(`Contact from ${name}`);
              const body = encodeURIComponent(`${message}\n\n- ${name}\n${email}`);
              window.location.href = `mailto:${OB_SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
            }}
          >
            <input
              name="name"
              required
              placeholder="Your name"
              className="rounded-xl border border-[#05070B]/15 bg-white px-4 py-3 text-sm font-semibold text-[#05070B] placeholder:text-[#05070B]/35 focus:border-[#D4AF37]/55 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-xl border border-[#05070B]/15 bg-white px-4 py-3 text-sm font-semibold text-[#05070B] placeholder:text-[#05070B]/35 focus:border-[#D4AF37]/55 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="How can we help?"
              className="rounded-xl border border-[#05070B]/15 bg-white px-4 py-3 text-sm font-semibold text-[#05070B] placeholder:text-[#05070B]/35 focus:border-[#D4AF37]/55 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
            />
            <button
              type="submit"
              className="mt-1 rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
            >
              Send message
            </button>
          </form>

          <p className="mx-auto mt-4 max-w-xl text-[10px] font-semibold text-[#05070B]/45">
            Opens your email app ·{" "}
            <a href={`mailto:${OB_SUPPORT_EMAIL}`} className="text-[#05070B]/70 underline-offset-2 hover:underline">
              {OB_SUPPORT_EMAIL}
            </a>
            {" · "}
            <a
              href={OB_GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#05070B]/70 underline-offset-2 hover:underline"
            >
              Leave a Google review
            </a>
          </p>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
