"use client";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useState } from "react";
import dynamic from "next/dynamic";
import MoodInput from "@/components/MoodInput";
import PlaceCard from "@/components/PlaceCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import type { Place } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[400px] animate-pulse rounded-2xl bg-stone-100" />
  ),
});

const examples = [
  "I want a cozy cafe in Bali for working with my laptop",
  "Mood: chill | Location: Bali | Budget: under 100k",
  "Cari tempat makan enak dekat sini",
  "Tempat santai buat nongkrong sama teman",
];

export default function Home() {
  const { coords } = useGeolocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [message, setMessage] = useState<string>(""); // ✅ tetap ada

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    // ✅ Guard: GPS belum siap
    if (!coords) {
      setMessage("Lokasi belum terdeteksi. Izinkan akses GPS lalu coba lagi.");
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setSelectedPlace(null);
    setShowMobileMap(false);
    setMessage(""); // ✅ reset pesan lama
    setPlaces([]);

    try {
      // ✅ try/catch agar loading tidak stuck
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: query,
          lat: coords.lat,
          lon: coords.lon,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // ✅ Simpan pesan dari server (error atau info kosong)
      if (data.message || data.error) {
        setMessage(data.message || data.error);
      }

      const raw: Place[] = data.places ?? [];

      const validated = raw.filter(
        (p) =>
          p &&
          typeof p.lat === "number" &&
          typeof p.lon === "number" &&
          isFinite(p.lat) &&
          isFinite(p.lon) &&
          p.lat >= -90 &&
          p.lat <= 90 &&
          p.lon >= -180 &&
          p.lon <= 180,
      );

      setPlaces(validated);
    } catch (err) {
      console.error("Search error:", err);
      setMessage("Gagal menghubungi server. Periksa koneksi lalu coba lagi."); // ✅ pesan error jaringan
    } finally {
      setLoading(false); // ✅ selalu matikan loading
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <h1 className="text-lg font-semibold tracking-tight text-stone-800">
            Melal<span className="text-emerald-600">AI</span>
          </h1>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
          Temukan tempat <span className="text-emerald-600">sesuai moodmu</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">
          Cari kafe, restoran, taman, atau tempat menarik di sekitarmu
          menggunakan AI. Cukup tulis suasana hati atau preferensi kamu dalam
          bahasa alami.
        </p>
      </section>

      {/* ── Search & Examples ── */}
      <section className="mb-8">
        <MoodInput coords={coords} onSearch={handleSearch} />

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-400">
            Coba salah satu:
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => handleSearch(ex)}
                disabled={loading}
                className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs text-stone-600 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="flex flex-1 flex-col gap-6 lg:flex-row">
        {/* Cards */}
        <div className="w-full lg:w-[380px] lg:shrink-0">
          {/* Belum pernah search */}
          {!hasSearched && !loading && (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-stone-200">
              <p className="px-4 text-center text-sm text-stone-400">
                Tulis mood kamu di atas, lalu klik Cari
                <br />
                untuk mulai menjelajah tempat di sekitarmu
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Sudah search, tidak ada hasil */}
          {hasSearched && !loading && places.length === 0 && (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-stone-200">
              <p className="px-4 text-center text-sm text-stone-400">
                {/* ✅ pakai message dari server, bukan teks hardcoded */}
                {message || "Tidak ada tempat ditemukan. Coba kata kunci lain."}
              </p>
            </div>
          )}

          {/* Ada hasil */}
          {!loading && places.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-stone-400">
                {places.length} tempat ditemukan
              </p>
              <div className="space-y-3">
                {places.map((p) => (
                  <PlaceCard
                    key={p.id}
                    place={p}
                    isSelected={selectedPlace?.id === p.id}
                    onSelect={setSelectedPlace}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map — desktop */}
        <div className="hidden flex-1 lg:block">
          <div className="sticky top-6 h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm">
            {coords ? (
              // ✅ jangan render saat mobile modal terbuka
              !showMobileMap && (
                <MapView
                  places={places}
                  center={coords}
                  selectedPlace={selectedPlace}
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-stone-400">Mendapatkan lokasi…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Mobile Map Trigger ── */}
      {coords && places.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:hidden">
          <button
            onClick={() => setShowMobileMap(true)}
            className="rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-stone-700"
          >
            Lihat di Peta
          </button>
        </div>
      )}

      {/* ── Mobile Map Modal ── */}
      {showMobileMap && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            onClick={() => setShowMobileMap(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-md"
          >
            Tutup
          </button>
          <div className="h-full w-full">
            {/* ✅ hanya render saat modal terbuka — desktop map sudah unmount */}
            {coords && (
              <MapView
                places={places}
                center={coords}
                selectedPlace={selectedPlace}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
