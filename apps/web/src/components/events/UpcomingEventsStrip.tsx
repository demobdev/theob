"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  formatEventDay,
  formatMonthTabLabel,
  getDefaultMonthKey,
  getEventsForMonth,
  getPublishedUpcomingEvents,
  getUpcomingEventMonthKeys,
  type UpcomingEvent,
} from "@/lib/upcomingEvents";

function EventCard({ event }: { event: UpcomingEvent }) {
  const { weekday, day, month } = formatEventDay(event.date);
  const body = (
    <>
      {event.image ? (
        <div className="absolute inset-0">
          <Image
            src={event.image}
            alt=""
            fill
            className="object-cover opacity-35"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/88 to-[#05070B]/55" />
        </div>
      ) : null}

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-end gap-2">
            <span className="font-montserrat text-4xl font-black leading-none tracking-[-0.06em] text-[#F2EAD4]">
              {day}
            </span>
            <div className="pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                {month}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                {weekday}
              </p>
            </div>
          </div>
          {event.tag ? (
            <span className="rounded-full border border-[#D4AF37]/35 bg-[#071B2F]/80 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-[#F2EAD4]">
              {event.tag}
            </span>
          ) : null}
        </div>

        <div>
          <h4 className="font-montserrat text-xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-white">
            {event.title}
          </h4>
          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-white/62">
            {event.description}
          </p>
          {event.time ? (
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#D4AF37]">
              {event.time}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );

  const className =
    "group relative h-[240px] min-w-[280px] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-[#D4AF37]/25 bg-[#101014] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/55 sm:min-w-[300px] sm:max-w-[300px]";

  if (event.href) {
    return (
      <Link href={event.href} className={className}>
        {body}
      </Link>
    );
  }

  return <article className={className}>{body}</article>;
}

export default function UpcomingEventsStrip() {
  const upcomingEvents = useMemo(() => getPublishedUpcomingEvents(), []);
  const monthKeys = useMemo(() => getUpcomingEventMonthKeys(upcomingEvents), [upcomingEvents]);
  const [activeMonth, setActiveMonth] = useState<string | null>(() =>
    getDefaultMonthKey(monthKeys),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const visibleEvents = useMemo(() => {
    if (!activeMonth) return [];
    return getEventsForMonth(upcomingEvents, activeMonth);
  }, [activeMonth, upcomingEvents]);

  const updateScrollState = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    setCanScrollLeft(node.scrollLeft > 8);
    setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [activeMonth, visibleEvents, updateScrollState]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    node.scrollTo({ left: 0, behavior: "smooth" });
    updateScrollState();
  }, [activeMonth, updateScrollState]);

  const scrollByCards = (direction: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;

    node.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (upcomingEvents.length === 0 || monthKeys.length === 0 || !activeMonth) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#05070B] p-6 text-white sm:p-8">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            On the calendar
          </p>
          <h3 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-5xl">
            Upcoming
            <br />
            Events
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {monthKeys.map((monthKey) => {
            const isActive = monthKey === activeMonth;
            return (
              <button
                key={monthKey}
                type="button"
                onClick={() => setActiveMonth(monthKey)}
                className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#05070B] shadow-[0_8px_24px_rgba(212,175,55,0.25)]"
                    : "border-white/15 bg-white/5 text-white/65 hover:border-white/30 hover:text-white"
                }`}
              >
                {formatMonthTabLabel(monthKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {visibleEvents.length > 0 ? (
            visibleEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="flex min-h-[240px] min-w-full items-center justify-center rounded-[24px] border border-dashed border-white/15 px-6 text-center">
              <p className="max-w-sm text-sm font-semibold leading-relaxed text-white/55">
                More dates for {formatMonthTabLabel(activeMonth)} are on the way. Check back soon
                or reach out to plan something custom.
              </p>
            </div>
          )}
        </div>

        {visibleEvents.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => scrollByCards("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll events left"
              className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#071B2F] text-[#F2EAD4] shadow-lg transition-opacity disabled:opacity-0 md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards("right")}
              disabled={!canScrollRight}
              aria-label="Scroll events right"
              className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#071B2F] text-[#F2EAD4] shadow-lg transition-opacity disabled:opacity-0 md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
