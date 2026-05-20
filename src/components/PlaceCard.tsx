"use client";
import type { Place } from "@/types";

const categoryIcons: Record<string, string> = {
  cafe: "☕",
  restaurant: "🍽️",
  restoran: "🍽️",
  warung: "🍜",
  park: "🌳",
  taman: "🌳",
  library: "📚",
  cinema: "🎬",
  museum: "🏛️",
  coworking: "💻",
  gym: "🏋️",
  bar: "🍸",
  hiburan: "🎯",
};

const categoryColors: Record<string, string> = {
  cafe: "bg-amber-50 text-amber-700 border-amber-200",
  restaurant: "bg-orange-50 text-orange-700 border-orange-200",
  restoran: "bg-orange-50 text-orange-700 border-orange-200",
  warung: "bg-rose-50 text-rose-700 border-rose-200",
  park: "bg-emerald-50 text-emerald-700 border-emerald-200",
  taman: "bg-emerald-50 text-emerald-700 border-emerald-200",
  library: "bg-sky-50 text-sky-700 border-sky-200",
  cinema: "bg-violet-50 text-violet-700 border-violet-200",
  museum: "bg-indigo-50 text-indigo-700 border-indigo-200",
  coworking: "bg-blue-50 text-blue-700 border-blue-200",
  gym: "bg-lime-50 text-lime-700 border-lime-200",
  bar: "bg-pink-50 text-pink-700 border-pink-200",
  hiburan: "bg-purple-50 text-purple-700 border-purple-200",
};

function getCategoryStyle(category: string) {
  return categoryColors[category] || "bg-stone-50 text-stone-600 border-stone-200";
}

export default function PlaceCard({
  place,
  isSelected,
  onSelect,
}: {
  place: Place;
  isSelected?: boolean;
  onSelect?: (place: Place) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(place)}
      className={`w-full text-left rounded-xl border p-4 shadow-sm transition-all 
        ${isSelected
          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={`text-sm font-semibold ${
              isSelected ? "text-emerald-800" : "text-stone-800"
            }`}
          >
            {place.name}
          </h3>

          {place.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-stone-500 line-clamp-2">
              {place.description}
            </p>
          )}
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${getCategoryStyle(place.category)}`}
        >
          {categoryIcons[place.category] || "📍"}
          {place.category}
        </span>
      </div>

      {place.address && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{place.address}</span>
        </div>
      )}

      {place.openingHours && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 text-stone-400"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
              clipRule="evenodd"
            />
          </svg>
          {place.openingHours}
        </div>
      )}

      {place.reason && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-3.5 w-3.5 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <span>{place.reason}</span>
        </div>
      )}

      {place.estimatedBudget && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.909 0-.848-.705-1.273-1.75-1.273zm0 0a2.48 2.48 0 00-.024.005zM9.25 7.182v-2.62A3.06 3.06 0 008.092 6.99c-.458.302-.592.652-.592.942 0 .797.697 1.25 1.75 1.25z" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.384C9.438 5.755 10.25 5.25 11.25 5.25c1.5 0 2.25.75 2.25 1.75 0 .766-.399 1.275-1.08 1.592.977.306 1.83.903 1.83 1.983 0 1.23-1.046 2.04-2.25 2.25v.425a.75.75 0 01-1.5 0v-.468c-.537-.066-1.09-.243-1.53-.574a.75.75 0 01.873-1.22c.313.223.81.512 1.407.512.618 0 1.03-.26 1.03-.677 0-.33-.261-.565-.99-.79-.726-.224-1.76-.626-1.76-1.768 0-.688.353-1.196 1.01-1.507V4.75a.75.75 0 011.5 0v.451c.46.07.895.23 1.275.47a.75.75 0 01-.826 1.252c-.277-.183-.66-.373-1.199-.373-.508 0-.82.194-.82.566 0 .379.31.548.857.745.676.244 1.61.579 1.61 1.632 0 .764-.434 1.23-1.115 1.437v.514a.75.75 0 01-1.5 0v-.473c-.52-.074-1.02-.257-1.385-.537a.75.75 0 01.84-1.244c.23.157.54.304.985.304.538 0 .93-.226.93-.687 0-.358-.266-.553-.86-.771-.733-.27-1.64-.635-1.64-1.634 0-.54.262-1.01.736-1.309z" />
          </svg>
          {place.estimatedBudget}
        </div>
      )}
    </button>
  );
}
