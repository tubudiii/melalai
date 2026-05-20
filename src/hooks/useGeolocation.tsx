"use client";
import { useState, useEffect } from "react";

// ✅ getCityName() DILETAKKAN DI SINI
// Dipanggil setelah kita dapat koordinat GPS
async function getCityName(lat: number, lon: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { "Accept-Language": "id" } },
  );
  const data = await res.json();
  return (
    data.address.city ||
    data.address.town ||
    data.address.village ||
    "Kota tidak diketahui"
  );
}

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [cityName, setCityName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      queueMicrotask(() => {
        setError("Browser tidak support geolocation");
        setLoading(false);
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        const city = await getCityName(lat, lon); // ← dipanggil di sini
        setCityName(city);
        setLoading(false);
      },
      () => {
        setError("Izin lokasi ditolak");
        setLoading(false);
      },
    );
  }, []);

  return { coords, cityName, error, loading };
}
