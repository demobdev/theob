"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OB_COORDS } from "@/lib/storeLocation";

const goldMarkerIcon = L.divIcon({
  className: "ob-marker-icon",
  html: `<div style="width:28px;height:28px;background:#D4AF37;border:3px solid #0A0A0A;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.5);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface LocationMapProps {
  location?: [number, number];
  userLocation: [number, number] | null;
  zoom?: number;
}

export default function LocationMap({
  location = [OB_COORDS.lat, OB_COORDS.lng],
  userLocation,
  zoom = 15,
}: LocationMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full bg-[#121212] animate-pulse rounded-2xl" />;
  }

  const center = userLocation ?? location;
  const mapZoom = userLocation ? Math.max(zoom, 14) : zoom;

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-0">
      <MapContainer
        center={center}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <ChangeView center={center} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <Marker position={location} icon={goldMarkerIcon}>
          <Popup className="ob-location-popup">
            <div className="px-1 py-0.5">
              <h4 className="font-black uppercase text-black text-sm tracking-tight">
                The Owner&apos;s Box
              </h4>
              <p className="text-xs text-gray-600 mt-1 font-medium">
                1757 Woodruff Rd. STE A, Greenville, SC
              </p>
            </div>
          </Popup>
        </Marker>

        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: "user-location-icon",
              html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup className="ob-location-popup">
              <span className="text-xs font-bold text-black">You are here</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #1a1a2e !important;
        }
        .ob-location-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          padding: 10px 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }
        .ob-location-popup .leaflet-popup-content {
          margin: 0;
          min-width: 160px;
        }
        .ob-location-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
