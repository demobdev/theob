"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Gift, Star, Tv, X, Zap } from "lucide-react";
import AppStoreBadges from "@/components/common/AppStoreBadges";

export const WEB_PROMO_DISMISS_KEY = "ob-web-promo-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const PROMO_PATHS = ["/", "/menu", "/rewards"];

const bullets = [
  { icon: Tv, text: "Live games & fight nights" },
  { icon: Star, text: "Earn points & order history" },
  { icon: Zap, text: "Faster reorder" },
  { icon: Gift, text: "Roster rewards" },
] as const;

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
        aria-labelledby="web-app-promo-title"
        aria-describedby="web-app-promo-description"
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
                  aria-label="Close app download promo"
                  className="absolute top-4 right-4 z-20 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={22} />
                </button>

                <div className="relative z-10 p-8 pt-10">
                  <span className="mb-4 inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                    Join the Roster
                  </span>

                  <Dialog.Title
                    id="web-app-promo-title"
                    className="text-3xl font-black uppercase leading-tight tracking-tight text-white"
                  >
                    Get the full experience{" "}
                    <span className="gold-text-gradient">in the app</span>
                  </Dialog.Title>

                  <Dialog.Description
                    id="web-app-promo-description"
                    className="mt-3 text-sm font-medium leading-relaxed text-gray-400"
                  >
                    Most features live on your phone — live games, rewards, and
                    the fastest way to order.
                  </Dialog.Description>

                  <ul className="mt-6 space-y-3">
                    {bullets.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                          <Icon className="h-4 w-4 text-[#D4AF37]" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wide text-white">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-3">
                    <p className="text-sm font-black uppercase tracking-wide text-[#D4AF37]">
                      $5 off your first order
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-400">
                      Join the Roster in the app — same offer as on the site.
                    </p>
                  </div>

                  <AppStoreBadges
                    direction="row"
                    className="mt-8 justify-center sm:justify-start"
                  />

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="mt-6 w-full text-center text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-300"
                  >
                    Continue on web
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
