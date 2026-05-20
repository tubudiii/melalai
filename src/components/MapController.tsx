"use client";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import type { Place } from "@/types";

function isValidCoord(lat: number, lon: number) {
  return (
    isFinite(lat) &&
    isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

export default function MapController({
  selectedPlace,
}: {
  selectedPlace: Place | null;
}) {
  const map = useMap();
  const prevId = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedPlace) return;
    if (!isValidCoord(selectedPlace.lat, selectedPlace.lon)) return;
    if (prevId.current === selectedPlace.id) return;

    prevId.current = selectedPlace.id;
    map.flyTo([selectedPlace.lat, selectedPlace.lon], 17, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedPlace, map]);

  return null;
}
