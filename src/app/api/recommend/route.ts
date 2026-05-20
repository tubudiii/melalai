import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Step 1: AI → kategori saja (bukan koordinat) ──────────────────────────
async function getCategories(mood: string): Promise<string[]> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Pilih 1-3 kategori tempat yang paling cocok dengan mood user.
Kategori yang tersedia: cafe, restaurant, bar, park, library, cinema, museum, gym
Balas HANYA dengan JSON: {"categories": ["cafe", "park"]}
Jangan tambahkan teks lain.`,
      },
      { role: "user", content: mood },
    ],
    temperature: 0.3,
    max_tokens: 80,
  });

  try {
    const text = completion.choices[0].message.content || "{}";
    const parsed = JSON.parse(text);
    const cats = parsed.categories;
    if (Array.isArray(cats) && cats.length > 0) return cats;
  } catch {}

  return ["cafe"]; // fallback kategori
}

// ── Step 2: Overpass API → tempat nyata dengan koordinat akurat ────────────
async function fetchFromOverpass(
  lat: number,
  lon: number,
  categories: string[],
  radiusMeters = 1500,
) {
  const amenityFilter = categories.join("|");

  const query = `[out:json][timeout:25];(node["amenity"~"${amenityFilter}"](around:${radiusMeters},${lat},${lon});way["amenity"~"${amenityFilter}"](around:${radiusMeters},${lat},${lon}););out center body;`;

  // ✅ GET request + User-Agent wajib untuk Overpass API
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "MelalAI/1.0 (portfolio project)",
    },
  });

  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();
  return data.elements ?? [];
}

// ── Helper: hitung jarak (meter) ──────────────────────────────────────────
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ── Main handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { mood, lat, lon } = await req.json();

  if (!lat || !lon) {
    return NextResponse.json({
      places: [],
      error: "Lokasi tidak tersedia. Izinkan akses GPS lalu coba lagi.",
    });
  }

  try {
    // Step 1 — AI tentukan kategori
    const categories = await getCategories(mood);

    // Step 2 — Overpass ambil tempat nyata
    const elements = await fetchFromOverpass(lat, lon, categories);

    const places = elements
      .filter((el: Record<string, unknown>) => {
        const tags = el.tags as Record<string, string> | undefined;
        // Hanya tampilkan tempat yang punya nama
        return tags?.name;
      })
      .map((el: Record<string, unknown>, i: number) => {
        const tags = el.tags as Record<string, string>;
        // way element pakai center, node pakai lat/lon langsung
        const placeLat =
          typeof el.center === "object" && el.center !== null
            ? (el.center as { lat: number }).lat
            : (el.lat as number);
        const placeLon =
          typeof el.center === "object" && el.center !== null
            ? (el.center as { lon: number }).lon
            : (el.lon as number);

        const distance = haversine(lat, lon, placeLat, placeLon);
        const address = [tags["addr:street"], tags["addr:housenumber"]]
          .filter(Boolean)
          .join(" ");

        return {
          id: (el.id as number) ?? Date.now() + i,
          name: tags.name,
          description: tags["description"] || tags["note"] || "",
          category: tags.amenity || categories[0],
          lat: placeLat,
          lon: placeLon,
          address: address || tags["addr:full"] || "",
          openingHours: tags["opening_hours"] || "",
          reason: "",
          estimatedBudget: "",
          distance,
        };
      })
      // Urutkan dari yang terdekat
      .sort(
        (a: { distance: number }, b: { distance: number }) =>
          a.distance - b.distance,
      )
      .slice(0, 10);

    if (places.length === 0) {
      return NextResponse.json({
        places: [],
        message: `Tidak ada ${categories.join("/")} ditemukan dalam radius 1.5km. Coba kata kunci lain.`,
      });
    }

    return NextResponse.json({ places });
  } catch (err) {
    console.error("recommend error:", err);
    return NextResponse.json({
      places: [],
      error: "Gagal mengambil data. Coba beberapa saat lagi.",
    });
  }
}
