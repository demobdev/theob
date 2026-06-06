"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import {
  ArrowLeft,
  Maximize2,
  Minus,
  Move,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MENU_IMAGE_URL = "/images/menu_new.png";
export const MENU_PDF_URL = "/menu_new.pdf";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function touchDistance(touches: { length: number; 0?: Touch; 1?: Touch }) {
  if (touches.length < 2 || !touches[0] || !touches[1]) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

type ZoomControlsProps = {
  zoom: number;
  onZoomChange: (value: number) => void;
  onReset: () => void;
  onFullscreen?: () => void;
  compact?: boolean;
};

function ZoomControls({
  zoom,
  onZoomChange,
  onReset,
  onFullscreen,
  compact,
}: ZoomControlsProps) {
  const pct = Math.round(zoom * 100);

  return (
    <div
      className={cn(
        "border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md",
        compact ? "px-3 py-3" : "px-4 py-4",
      )}
    >
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => onZoomChange(clampZoom(zoom - ZOOM_STEP))}
          disabled={zoom <= MIN_ZOOM}
          className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#D4AF37]/50 disabled:opacity-30 transition-colors"
          aria-label="Zoom out"
        >
          <Minus size={18} />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-3">
          <input
            type="range"
            min={MIN_ZOOM * 100}
            max={MAX_ZOOM * 100}
            step={5}
            value={pct}
            onChange={(e) => onZoomChange(clampZoom(Number(e.target.value) / 100))}
            className="menu-zoom-slider w-full h-2 appearance-none rounded-full cursor-pointer accent-[#D4AF37] bg-white/10"
            aria-label="Zoom level"
            aria-valuemin={100}
            aria-valuemax={400}
            aria-valuenow={pct}
          />
          <span className="text-[#D4AF37] font-black text-xs tabular-nums w-12 shrink-0 text-right">
            {pct}%
          </span>
        </div>

        <button
          type="button"
          onClick={() => onZoomChange(clampZoom(zoom + ZOOM_STEP))}
          disabled={zoom >= MAX_ZOOM}
          className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#D4AF37]/50 disabled:opacity-30 transition-colors"
          aria-label="Zoom in"
        >
          <Plus size={18} />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#D4AF37]/50 transition-colors"
          aria-label="Reset zoom"
        >
          <RotateCcw size={16} />
        </button>

        {onFullscreen && (
          <button
            type="button"
            onClick={onFullscreen}
            className="h-10 px-3 shrink-0 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center gap-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
            aria-label="Open fullscreen menu"
          >
            <Maximize2 size={16} />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">
              Fullscreen
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

type MenuCanvasProps = {
  zoom: number;
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  className?: string;
  imageClassName?: string;
};

function MenuCanvas({
  zoom,
  pan,
  onPanChange,
  onZoomChange,
  className,
  imageClassName,
}: MenuCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const touchPanRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const next = clampZoom(zoomRef.current + delta);
      onZoomChange(next);
      if (next === 1) onPanChange({ x: 0, y: 0 });
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [onPanChange, onZoomChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomRef.current <= 1) return;
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
    }
    onPanChange({
      x: dragRef.current.panX + dx,
      y: dragRef.current.panY + dy,
    });
  };

  const endPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    if (dragRef.current.moved) suppressClickRef.current = true;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      touchPanRef.current = null;
      pinchRef.current = { dist: touchDistance(e.touches), zoom: zoomRef.current };
      return;
    }
    if (e.touches.length === 1 && zoomRef.current > 1) {
      pinchRef.current = null;
      touchPanRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dist = touchDistance(e.touches);
      if (pinchRef.current.dist === 0) return;
      const ratio = dist / pinchRef.current.dist;
      const next = clampZoom(pinchRef.current.zoom * ratio);
      onZoomChange(next);
      if (next === 1) onPanChange({ x: 0, y: 0 });
      return;
    }
    if (e.touches.length === 1 && touchPanRef.current) {
      onPanChange({
        x:
          touchPanRef.current.panX +
          (e.touches[0].clientX - touchPanRef.current.startX),
        y:
          touchPanRef.current.panY +
          (e.touches[0].clientY - touchPanRef.current.startY),
      });
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
    touchPanRef.current = null;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (zoomRef.current > 1) return;
    if (e.detail > 1) return;
    onZoomChange(2);
  };

  const handleDoubleClick = () => {
    if (zoomRef.current > 1) {
      onZoomChange(1);
      onPanChange({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-[#111] select-none",
        zoom > 1 ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-zoom-in touch-pan-y",
        className,
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointerDrag}
      onPointerCancel={endPointerDrag}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div
          className="will-change-transform transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <Image
            src={MENU_IMAGE_URL}
            alt="The Owner's Box full menu — appetizers, wings, pizza, brunch, and more"
            width={1536}
            height={1024}
            className={cn(
              "w-full h-auto max-w-[1200px] select-none pointer-events-none",
              imageClassName,
            )}
            draggable={false}
            priority
          />
        </div>
      </div>

      {zoom <= 1.05 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 px-4 py-2 pointer-events-none max-w-[calc(100%-2rem)]">
          <Move size={14} className="text-[#D4AF37] shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80 text-center">
            Slider below · scroll wheel · click to zoom · drag when zoomed
          </span>
        </div>
      )}
    </div>
  );
}

function useMenuViewState() {
  const [zoom, setZoomState] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const setZoom = useCallback((value: number) => {
    const next = clampZoom(value);
    setZoomState(next);
    if (next === 1) setPan({ x: 0, y: 0 });
  }, []);

  const resetView = useCallback(() => {
    setZoomState(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return { zoom, pan, setZoom, setPan, resetView };
}

export default function MenuViewer() {
  const inline = useMenuViewState();
  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenView = useMenuViewState();
  const fullscreenZoomRef = useRef(fullscreenView.zoom);
  const fullscreenSetZoomRef = useRef(fullscreenView.setZoom);
  fullscreenZoomRef.current = fullscreenView.zoom;
  fullscreenSetZoomRef.current = fullscreenView.setZoom;

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "+" || e.key === "=") {
        fullscreenSetZoomRef.current(
          clampZoom(fullscreenZoomRef.current + ZOOM_STEP),
        );
      }
      if (e.key === "-") {
        fullscreenSetZoomRef.current(
          clampZoom(fullscreenZoomRef.current - ZOOM_STEP),
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const openFullscreen = () => {
    fullscreenView.resetView();
    setFullscreen(true);
  };

  return (
    <>
      <div className="premium-card overflow-hidden border-white/10 bg-black/60">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-black/40">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            Interactive menu
          </p>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest hidden sm:block">
            Scroll · slider · drag to explore
          </p>
        </div>

        <MenuCanvas
          zoom={inline.zoom}
          pan={inline.pan}
          onPanChange={inline.setPan}
          onZoomChange={inline.setZoom}
          className="h-[min(65vh,680px)] min-h-[360px]"
        />

        <ZoomControls
          zoom={inline.zoom}
          onZoomChange={inline.setZoom}
          onReset={inline.resetView}
          onFullscreen={openFullscreen}
        />
      </div>

      <Transition show={fullscreen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[120]"
          onClose={() => setFullscreen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/95 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-[121] flex flex-col pointer-events-none">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-2"
            >
              <Dialog.Panel className="flex flex-col h-full pointer-events-auto">
                <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-white/10 bg-black/90 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFullscreen(false)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-[10px] sm:text-xs gold-glow hover:scale-[1.02] transition-transform"
                  >
                    <ArrowLeft size={16} />
                    Back to Menu
                  </button>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden md:block">
                    Esc to close · +/- to zoom
                  </p>
                  <button
                    type="button"
                    onClick={() => setFullscreen(false)}
                    className="h-11 w-11 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#D4AF37]/50 transition-colors"
                    aria-label="Close fullscreen menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <MenuCanvas
                  zoom={fullscreenView.zoom}
                  pan={fullscreenView.pan}
                  onPanChange={fullscreenView.setPan}
                  onZoomChange={fullscreenView.setZoom}
                  className="flex-1 min-h-0"
                  imageClassName="max-h-[calc(100vh-180px)]"
                />

                <ZoomControls
                  zoom={fullscreenView.zoom}
                  onZoomChange={fullscreenView.setZoom}
                  onReset={fullscreenView.resetView}
                  compact
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
