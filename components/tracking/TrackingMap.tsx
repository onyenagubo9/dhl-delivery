"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngTuple } from "leaflet";

/* ================= TYPES ================= */

type Location = {
  lat: number;
  lng: number;
  address?: string;
};

type Props = {
  location?: Location | null;
};

/* ================= DYNAMIC IMPORTS (SSR SAFE) ================= */

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

/* ================= COMPONENT ================= */

export default function TrackingMap({ location }: Props) {
  const markerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  /* ---------- SAFETY CHECK ---------- */
  if (!location || location.lat == null || location.lng == null) {
    return (
      <div className="mt-6 p-6 rounded-xl bg-gray-100 text-gray-500 text-sm">
        Location not available yet
      </div>
    );
  }

  const center: LatLngTuple = [location.lat, location.lng];

  /* ---------- LOAD LEAFLET (CLIENT ONLY) ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      const L = await import("leaflet");

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setReady(true);
    })();
  }, []);

  /* ---------- SMOOTH MARKER UPDATE ---------- */
  useEffect(() => {
    if (!markerRef.current) return;

    markerRef.current.setLatLng(center);
  }, [location.lat, location.lng]);

  if (!ready) {
    return (
      <div className="mt-6 h-100 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
        Loading map…
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="mt-6 h-100 rounded-xl overflow-hidden shadow border">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center} ref={markerRef}>
          <Popup>
            📍 {location.address || "Current location"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
