"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { MapPin, UtensilsCrossed, X } from "lucide-react";

export const WEB_PROMO_DISMISS_KEY = "ob-open-announcement-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const PROMO_PATHS = ["/", "/menu"];

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(WEB_PROMO_DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number.parseInt(raw, 10);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function persistDismissal(): void {
  try {
    localStorage.setItem(WEB_PROMO_DISMISS_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

function shouldShowOnPath(pathname: string): boolean {
  return PROMO_PATHS.includes(pathname);
}

export default function AppDownloadPromoModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleDismiss = useCallback(() => {
    persistDismissal();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!shouldShowOnPath(pathname) || isDismissed()) {
      setIsOpen(false);
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!shouldShowOnPath(pathname)) {
    return null;
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[1200]"
        onClose={handleDismiss}
        aria-labelledby="open-announcement-title"
        aria-describedby="open-announcement-description"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
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
              <Dialog.Panel className="relative isolate w-full max-w-md transform overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-[#1a1a1a] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] transition-all">
                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Close announcement"
                  className="absolute top-4 right-4 z-20 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={22} />
                </button>

                <div className="relative z-10 p-8 pt-10 text-center">
                  <span className="mb-4 inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                    Now Open
                  </span>

                  <Dialog.Title
                    id="open-announcement-title"
                    className="text-3xl font-black uppercase leading-tight tracking-tight text-white"
                  >
                    Ready for{" "}
                    <span className="gold-text-gradient">game day.</span>
                  </Dialog.Title>

                  <Dialog.Description
                    id="open-announcement-description"
                    className="mt-4 text-base font-medium leading-relaxed text-gray-300"
                  >
                    Wings, craft pizza, cold drinks, and 14 HD screens. Pull up to 1757 Woodruff Rd, order takeout online, or get delivery on DoorDash.
                  </Dialog.Description>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href="/locations"
                      onClick={handleDismiss}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      <MapPin size={16} />
                      Visit Us
                    </Link>
                    <Link
                      href="/menu"
                      onClick={handleDismiss}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                    >
                      <UtensilsCrossed size={16} />
                      View Menu
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="mt-6 w-full text-center text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-300"
                  >
                    Got it
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
