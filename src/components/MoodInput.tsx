"use client";
import { useState } from "react";

export default function MoodInput({
  coords,
  onSearch,
}: {
  coords: { lat: number; lon: number } | null;
  onSearch: (query: string) => void;
}) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = mood.trim();
    if (!trimmed || !coords) return;
    setLoading(true);
    await onSearch(trimmed);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-1 shadow-sm ring-1 ring-stone-900/5 transition-shadow focus-within:shadow-md focus-within:ring-emerald-500/20">
      <div className="flex items-center gap-2">
        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Lagi pengen ngopi santai sambil kerja pake laptop..."
          disabled={!coords}
          className="flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-sm placeholder-stone-400 outline-none focus:ring-0 disabled:opacity-50"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !mood.trim() || !coords}
          className="mr-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Mencari
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              Cari
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
