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
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            if (isValidCoord(latitude, longitude)) {
              map.setView([latitude, longitude], 15);
            }
          },
          () => {},
        );
      }
      isInitial.current = false;
      return;
    }

    if (!selectedPlace) return;
    if (!isValidCoord(selectedPlace.lat, selectedPlace.lon)) return;

    if (prevId.current !== selectedPlace.id) {
      prevId.current = selectedPlace.id;
      map.flyTo([selectedPlace.lat, selectedPlace.lon], 16, {
        duration: 1,
      });
    }
  }, [selectedPlace, map]);

  return null;
}
