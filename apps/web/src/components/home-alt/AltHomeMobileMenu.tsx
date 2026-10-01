"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

type Props = {
  navLinks: NavLink[];
  utilityLinks: NavLink[];
  phoneLabel: string;
  phoneHref: string;
  orderUrl: string;
};

export default function AltHomeMobileMenu({
  navLinks,
  utilityLinks,
  phoneLabel,
  phoneHref,
  orderUrl,
}: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const controls = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]',
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#05070B] text-[#05070B] transition-transform hover:scale-105 md:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="alt-home-mobile-menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 md:hidden",
            open ? "pointer-events-auto" : "pointer-events-none",
          )}
          aria-hidden={!open}
        >
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={close}
            className={cn(
              "absolute inset-0 bg-[#05070B]/50 transition-opacity duration-200",
              open ? "opacity-100" : "opacity-0",
            )}
          />

          <div
            ref={panelRef}
            id="alt-home-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={cn(
              "absolute left-0 right-0 top-0 max-h-[100dvh] overflow-y-auto bg-white px-5 pb-8 pt-4 shadow-2xl transition-transform duration-200 ease-out",
              open ? "translate-y-0" : "-translate-y-full",
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-montserrat text-sm font-black uppercase tracking-tight text-[#05070B]">
                Menu
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#05070B] text-[#05070B]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="space-y-8">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#05070B]/45">
                  Visit
                </p>
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block font-montserrat text-2xl font-black uppercase tracking-tight text-[#05070B] transition-opacity hover:opacity-60"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#05070B]/45">
                  More
                </p>
                <ul className="space-y-3">
                  {utilityLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block text-sm font-black uppercase tracking-[0.18em] text-[#05070B]/80 transition-opacity hover:opacity-60"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#05070B]/10 pt-6">
                <a
                  href={phoneHref}
                  onClick={close}
                  className="inline-flex justify-center rounded-full border-2 border-[#05070B]/15 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#05070B]"
                >
                  {phoneLabel}
                </a>
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="inline-flex justify-center rounded-full border-2 border-[#05070B] bg-[#05070B] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white"
                >
                  Order Now
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
