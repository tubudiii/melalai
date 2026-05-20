"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import MapController from "./MapController";
import type { Place } from "@/types";

const defaultIcon = L.icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;background:#059669;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
      <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28], // ✅ fix: anchor di bawah tengah, bukan di tengah
  popupAnchor: [0, -30],
});

const categoryIcons: Record<string, string> = {
  cafe: "☕",
  restaurant: "🍽️",
  restoran: "🍽️",
  park: "🌳",
  taman: "🌳",
  library: "📚",
  cinema: "🎬",
};

function PlaceMarker({
  place,
  isSelected,
}: {
  place: Place;
  isSelected: boolean;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[place.lat, place.lon]}
      icon={isSelected ? selectedIcon : defaultIcon}
    >
      <Popup>
        <div className="min-w-[160px]">
          <p className="text-sm font-semibold">{place.name}</p>
          {place.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
              {place.description}
            </p>
          )}
          <p className="mt-1 text-xs capitalize text-stone-500">
            {categoryIcons[place.category] || "📍"} {place.category}
          </p>
          {place.address && (
            <p className="mt-1 text-xs text-stone-400">📍 {place.address}</p>
          )}
          {place.openingHours && (
            <p className="mt-0.5 text-xs text-stone-400">
              🕐 {place.openingHours}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapView({
  places,
  center,
  selectedPlace,
}: {
  places: Place[];
  center: { lat: number; lon: number };
  selectedPlace: Place | null;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={15}
      style={{ height: "100%", borderRadius: "inherit" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {places.map((p) => (
        <PlaceMarker
          key={p.id}
          place={p}
          isSelected={selectedPlace?.id === p.id}
        />
      ))}

      {/* ✅ fix: hapus key={selectedPlace?.id} agar tidak remount */}
      <MapController selectedPlace={selectedPlace} />
    </MapContainer>
  );
}
