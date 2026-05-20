"use client";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapController({
  selectedPlace,
}: {
  selectedPlace: { lat: number; lon: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedPlace &&
      isFinite(selectedPlace.lat) &&
      isFinite(selectedPlace.lon)
    ) {
      map.flyTo([selectedPlace.lat, selectedPlace.lon], 16, {
        duration: 1,
      });
    }
  }, [selectedPlace, map]);

  return null;
}
