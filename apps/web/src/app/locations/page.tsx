"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  LocateFixed,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import {
  OB_COORDS,
  OB_ADDRESS,
  OB_MAP_ZOOM,
  OB_HOURS,
  OB_AMENITIES,
  haversineMiles,
  formatDistanceAndDrive,
} from "@/lib/storeLocation";
import { getOrderPagePath } from "@/lib/orderLinks";
import { OB_GOOGLE_REVIEW_URL, OB_SUPPORT_EMAIL } from "@/lib/localSeo";
import DoorDashButton from "@/components/common/DoorDashButton";

const LocationMap = dynamic(() => import("@/components/locations/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#121212] animate-pulse rounded-2xl flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
      Loading Map...
    </div>
  ),
});

const OB_LOCATION: [number, number] = [OB_COORDS.lat, OB_COORDS.lng];

const featureTiles = [
  {
    title: "Game Day",
    text: "Cold drinks and a room built for regulars.",
    image: "/images/atmosphere/cinematic-dtl-1.jpg",
    imagePosition: "center 28%",
  },
  {
    title: "Cold Drinks",
    text: "Craft cocktails, beer, and wine for dine-in — easy hangs and Greenville nights out.",
    image: "/images/couple-at-bar.png.jpg",
    imagePosition: "center 62%",
  },
  {
    title: "Good Eats",
    text: "Pizza, wings, shareables, and bar favorites.",
    image: "/images/food/official/featured-pizza.png",
  },
];

const galleryImages = [
  "/images/couple-at-bar.png.jpg",
  "/images/drinks/esspresso-martini.JPG",
  "/images/food/official/featured-pizza.png",
  "/images/food/official/lamb-gyro.jpg",
  "/images/food/official/bang-bang-shrimp-3.png",
  "/images/food/official/buffalo-pizza.jpg",
  "/images/food/buffalo-wings.png",
  "/images/food/garlic-parm-wings.png",
  "/images/food/lemon-pepper-wings-2.png",
  "/images/atmosphere/ob-front.png",
  "/images/food/official/crab-dip.png",
  "/images/food/official/beer-classic.jpg",
  "/images/drinks/espresso-martini-2.jpg",
  "/images/food/official/late-night-fun.jpg",
  "/images/atmosphere/bar-guest-friends.jpg",
  "/images/food/official/staff.jpg",
  "/images/food/official/hand-fry-dipped.jpg",
  "/images/atmosphere/big-wall-left-1.jpg",
  "/images/atmosphere/wide-view-from-right.jpg",
  "/images/drinks/cocktail-on-bar-1.jpg",
];

const galleryImageAlts: Record<string, string> = {
  "/images/couple-at-bar.png.jpg": "Couple at the bar",
  "/images/drinks/esspresso-martini.JPG": "Espresso martini",
  "/images/food/official/featured-pizza.png": "Featured pizza",
  "/images/food/official/lamb-gyro.jpg": "Lamb gyro with fries",
  "/images/food/official/hand-fry-dipped.jpg": "Gyro, fries, and a dip at the bar",
  "/images/food/official/bang-bang-shrimp-3.png": "Bang bang shrimp",
  "/images/food/official/buffalo-pizza.jpg": "Buffalo chicken pizza",
  "/images/food/buffalo-wings.png": "Classic buffalo wings",
  "/images/food/garlic-parm-wings.png": "Garlic parmesan wings",
  "/images/food/lemon-pepper-wings-2.png": "Lemon pepper wings",
  "/images/atmosphere/ob-front.png": "The Owner's Box storefront at night",
  "/images/food/official/crab-dip.png": "Crab dip with pita chips",
  "/images/food/official/beer-classic.jpg": "Cold beer and a shot at the bar",
  "/images/drinks/espresso-martini-2.jpg": "Espresso martini at the bar",
  "/images/food/official/late-night-fun.jpg": "Friends enjoying a late night at the bar",
  "/images/atmosphere/bar-guest-friends.jpg": "Guests smiling at the bar",
  "/images/food/official/staff.jpg": "The Owner's Box staff",
  "/images/atmosphere/big-wall-left-1.jpg": "Sports bar wall of screens",
  "/images/atmosphere/wide-view-from-right.jpg": "Wide dining room view",
  "/images/drinks/cocktail-on-bar-1.jpg": "Cocktail on the bar",
};

const barSpecials = [
  {
    label: "Scratch-made menu",
    title: "Wings & Pizza",
  },
  {
    label: "Dine-in bar",
    title: "Beer & Wine",
  },
  {
    label: "Wall-to-wall screens",
    title: "Sports On TV",
  },
];

function FeatureImageTile({
  src,
  title,
  imagePosition = "center",
  className = "",
}: {
  src: string;
  title: string;
  imagePosition?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-[300px] overflow-hidden sm:min-h-[360px] lg:h-[400px] ${className}`}
    >
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        style={{ objectPosition: imagePosition }}
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}

function FeatureCopyTile({
  title,
  text,
  className = "",
}: {
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[300px] flex-col items-center justify-center bg-[#101014] p-8 text-center text-white sm:min-h-[360px] lg:h-[400px] ${className}`}
    >
      <h3 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-5xl">
        {title}
      </h3>
      <p className="mx-auto mt-5 max-w-xs text-xs font-semibold leading-relaxed text-white/62">
        {text}
      </p>
    </div>
  );
}

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

function LocationsGalleryMarquee({ images }: { images: string[] }) {
  const [isPaused, setIsPaused] = useState(false);
  const carouselImages = [...images, ...images];

  return (
    <section className="ob-canvas overflow-hidden bg-white pb-16">
      <div
        className={`flex w-max gap-4 px-4 ${isPaused ? "" : "animate-marquee-slow"}`}
      >
        {carouselImages.map((src, index) => (
          <button
            type="button"
            key={`${src}-${index}`}
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "Resume gallery scroll" : "Pause gallery scroll"}
            className="relative h-40 w-40 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#05070B]/10 bg-white sm:h-56 sm:w-56"
          >
            <Image
              src={src}
              alt={galleryImageAlts[src] ?? "Gallery photo"}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="224px"
            />
          </button>
        ))}
      </div>
    </section>
  );
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

      <section className="bg-white px-4 pb-12 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-10">
          <div className="relative min-h-[520px] overflow-hidden rounded-[24px] border-2 border-[#05070B]/10">
            <Image
              src="/sports-feature.jpg"
              alt="The Owner's Box sports bar and grill in Greenville SC on Woodruff Road"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1600px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/34 to-black/5" />
            <div className="absolute left-5 top-5 w-[min(440px,calc(100%-40px))] rounded-[24px] border border-white/20 bg-white p-5 text-[#05070B] shadow-2xl sm:left-8 sm:top-8 sm:p-7">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#05070B]/60">
                Sports bar & grill · Greenville, SC
              </p>
              <h1 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-6xl">
                Come
                <br />
                See Us
              </h1>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-[#05070B]/68">
                Family-friendly dining on Woodruff Road — kids menu, big screens, and game-day energy.
              </p>
              <div className="mt-6 grid gap-2">
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-white"
                >
                  Order takeout
                </a>
                <a
                  href={buildDirectionsUrl(userLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-[#05070B] bg-white px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-[#05070B]"
                >
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 py-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
              Location + contact
            </p>
            <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-7xl">
              Come See Us
            </h2>
          </div>
          <div className="max-w-2xl text-sm font-semibold leading-relaxed text-[#05070B]/68">
            Now open at {OB_ADDRESS.line1} in Greenville, SC. A family-friendly sports bar and grill
            with scratch-made wings, pizza, and steaks — dine in, order takeout online, or get DoorDash
            delivery.
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 pb-20 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] overflow-hidden rounded-[28px] border border-[#D4AF37]/35 bg-[#101014] shadow-[0_28px_90px_rgba(0,0,0,0.18)] lg:grid-cols-2">
          <div className="grid">
            <FeatureImageTile
              src={featureTiles[0]!.image}
              title={featureTiles[0]!.title}
              imagePosition={featureTiles[0]!.imagePosition}
            />
            <FeatureCopyTile title={featureTiles[0]!.title} text={featureTiles[0]!.text} />
          </div>

          <div className="grid">
            <FeatureCopyTile title={featureTiles[1]!.title} text={featureTiles[1]!.text} />
            <FeatureImageTile
              src={featureTiles[1]!.image}
              title={featureTiles[1]!.title}
              imagePosition={featureTiles[1]!.imagePosition}
            />
          </div>

          <div className="grid lg:col-span-2 lg:grid-cols-2">
            <FeatureImageTile
              src={featureTiles[2]!.image}
              title={featureTiles[2]!.title}
            />
            <FeatureCopyTile
              title={featureTiles[2]!.title}
              text={featureTiles[2]!.text}
            />
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 pb-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-[#05070B]/10 bg-[#101014] p-7 text-white sm:p-10">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
                  Woodruff Rd
                </p>
                <h3 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.06em]">
                  {OB_ADDRESS.name}
                </h3>
              </div>
              <MapPin className="h-8 w-8 text-white" />
            </div>

            {distanceLabel && (
              <p className="mb-5 inline-block rounded-full border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                {distanceLabel}
              </p>
            )}

            <div className="mb-8 grid gap-4 text-sm font-semibold text-white/72">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-white/45" />
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
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-white/45" />
                <p>
                  {OB_HOURS.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="mt-1 h-5 w-5 shrink-0 text-white/45" />
                <p>{OB_AMENITIES.join(" · ")}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={requestLocation}
              disabled={geoLoading}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#05070B] disabled:opacity-50"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {geoLoading ? "Locating..." : "Use My Location"}
            </button>

            <div className="grid gap-3">
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#05070B]"
              >
                Order Takeout
                <ExternalLink size={12} />
              </a>
              <DoorDashButton fullWidth />
              <a
                href={OB_GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#05070B] transition-colors hover:bg-[#c9a430]"
              >
                Leave a Google review
                <ExternalLink size={12} />
              </a>
              <a
                href={buildDirectionsUrl(userLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#05070B]"
              >
                <Navigation className="h-3 w-3" />
                Directions
              </a>
            </div>

            {geoError && (
              <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs font-bold uppercase leading-relaxed tracking-widest text-white/80">
                {geoError}
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="mt-3 block font-black normal-case tracking-normal text-white underline"
                >
                  {geoLoading ? "Locating..." : "Try again"}
                </button>
              </div>
            )}
          </div>

          <div
            ref={mapContainerRef}
            className="min-h-[520px] overflow-hidden rounded-[28px] border border-[#05070B]/10"
          >
            {mapVisible ? (
              <LocationMap location={OB_LOCATION} userLocation={userLocation} zoom={OB_MAP_ZOOM} />
            ) : (
              <div className="flex h-full min-h-[520px] w-full items-center justify-center rounded-2xl bg-[#121212] text-xs font-bold uppercase tracking-widest text-gray-500">
                Map loads when in view
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="ob-canvas overflow-hidden border-y border-[#05070B]/10 bg-white py-2 text-[#05070B]">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center">
              <span className="px-6 font-montserrat text-4xl font-black uppercase tracking-[-0.06em] sm:text-6xl">
                Good Times
              </span>
              <span className="px-6 font-montserrat text-4xl font-black uppercase tracking-[-0.06em] sm:text-6xl">
                Come See Us
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="ob-canvas bg-white px-4 py-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
              What we serve
            </p>
            <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em]">
              Food,
              <br />
              Drinks & Screens
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {barSpecials.map((special) => (
              <div key={special.title} className="rounded-[24px] border border-white/10 bg-white p-6 text-[#05070B]">
                <CalendarDays className="mb-8 h-8 w-8" />
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#05070B]/55">
                  {special.label}
                </p>
                <p className="mt-2 font-montserrat text-3xl font-black uppercase leading-[0.85] tracking-[-0.06em]">
                  {special.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 pb-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-8 rounded-[28px] border border-[#05070B]/10 bg-[#101014] p-7 text-white sm:p-10 lg:grid-cols-[0.65fr_1fr]">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
              Groups & watch parties
            </p>
            <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em]">
              Bring The
              <br />
              Crew
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <Trophy className="h-10 w-10" />
            <div>
              <p className="text-sm font-semibold leading-relaxed text-white/68">
                Birthdays, fantasy draft nights, corporate outings, and big-game watch parties —
                with shared apps, wings, pizza, and screens when schedules allow.
              </p>
              <Link
                href="/private-events"
                className="mt-6 inline-flex rounded-full border-2 border-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#05070B]"
              >
                Plan a private event
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LocationsGalleryMarquee images={galleryImages} />

      <section id="contact" className="ob-canvas scroll-mt-28 bg-white px-4 pb-20 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-8 rounded-[28px] border border-[#05070B]/10 bg-white p-7 text-[#05070B] sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Mail className="mb-8 h-9 w-9" />
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
              Talk to us
            </p>
            <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em]">
              Contact
              <br />
              Us
            </h2>
            <p className="mt-6 max-w-sm text-sm font-semibold leading-relaxed text-[#05070B]/65">
              Questions about your order, private events, or hosting a group? We reply during
              business hours.
            </p>
          </div>

          <form
            className="grid gap-4"
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
              className="rounded-2xl border-2 border-[#05070B]/15 bg-white px-4 py-4 text-sm font-black uppercase tracking-widest text-[#05070B] placeholder:text-[#05070B]/35 focus:border-[#05070B] focus:outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-2xl border-2 border-[#05070B]/15 bg-white px-4 py-4 text-sm font-black uppercase tracking-widest text-[#05070B] placeholder:text-[#05070B]/35 focus:border-[#05070B] focus:outline-none"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="How can we help?"
              className="rounded-2xl border-2 border-[#05070B]/15 bg-white px-4 py-4 text-sm font-black uppercase tracking-widest text-[#05070B] placeholder:text-[#05070B]/35 focus:border-[#05070B] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white"
            >
              Send Message
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#05070B]/45">
              Opens your email app — {OB_SUPPORT_EMAIL}
            </p>
            <a
              href={OB_GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] underline-offset-4 hover:underline"
            >
              Loved your visit? Leave us a Google review
              <ExternalLink className="h-3 w-3" />
            </a>
          </form>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
