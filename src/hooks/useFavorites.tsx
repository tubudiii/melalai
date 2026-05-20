"use client";
import { useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locallens-favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggle = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("locallens-favorites", JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);
  return { favorites, toggle, isFavorite };
}
