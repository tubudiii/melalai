import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const fallbackPlaces = [
  {
    id: 1,
    name: "Kopi Senja",
    description:
      "Kafe nyaman dengan suasana tenang dan colokan listrik di setiap meja.",
    category: "cafe",
    address: "Jl. Raya Ubud No. 12",
    lat: -8.4095,
    lon: 115.1889,
    openingHours: "08:00-22:00",
    reason: "Cocok untuk bekerja dengan suasana tenang",
    estimatedBudget: "Rp 30.000 - Rp 60.000",
  },
  {
    id: 2,
    name: "Warung Bu Karjo",
    description:
      "Warung makan dengan menu tradisional khas Bali yang autentik.",
    category: "restaurant",
    address: "Jl. Diponegoro No. 45",
    lat: -8.411,
    lon: 115.187,
    openingHours: "10:00-21:00",
    reason: "Tempat makan enak dengan harga terjangkau",
    estimatedBudget: "Rp 20.000 - Rp 50.000",
  },
  {
    id: 3,
    name: "Taman Kota",
    description:
      "Taman kota yang asri dengan area duduk dan jalur pejalan kaki.",
    category: "park",
    address: "Jl. Ngurah Rai",
    lat: -8.41,
    lon: 115.19,
    openingHours: "06:00-18:00",
    reason: "Tempat santai di tengah kota",
    estimatedBudget: "Gratis",
  },
  {
    id: 4,
    name: "Perpustakaan Daerah",
    description:
      "Perpustakaan umum dengan ruang baca yang tenang dan koleksi buku lengkap.",
    category: "library",
    address: "Jl. Pahlawan No. 1",
    lat: -8.412,
    lon: 115.186,
    openingHours: "08:00-20:00",
    reason: "Suasana hening cocok untuk membaca atau kerja",
    estimatedBudget: "Gratis",
  },
  {
    id: 5,
    name: "Bioskop Grand",
    description: "Bioskop modern dengan layar lebar dan tempat duduk nyaman.",
    category: "cinema",
    address: "Jl. Sudirman No. 99",
    lat: -8.407,
    lon: 115.192,
    openingHours: "10:00-23:00",
    reason: "Hiburan malam yang menyenangkan",
    estimatedBudget: "Rp 40.000 - Rp 80.000",
  },
];

function extractJSON(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

function validatePlaces(data: unknown): { places: unknown[] } | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.places)) return null;
  return obj as { places: unknown[] };
}

export async function POST(req: NextRequest) {
  const { mood, lat, lon } = await req.json();

  const locationInfo =
    lat && lon
      ? `Lokasi user (lat: ${lat}, lon: ${lon}) — generate tempat di sekitar koordinat ini.`
      : "Lokasi user tidak diketahui — generate tempat populer secara umum.";

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten rekomendasi tempat lokal yang membantu user menemukan tempat menarik.

${locationInfo}

Berdasarkan mood/preferensi user, buat 3-5 rekomendasi tempat yang relevan.
Setiap tempat HARUS memiliki data berikut dalam format JSON:
{
  "places": [
    {
      "name": "Nama Tempat",
      "description": "Deskripsi singkat tempat ini (1 kalimat)",
      "category": "salah satu dari: cafe, restaurant, park, library, cinema, museum, coworking, gym, bar, warung, hiburan",
      "lat": <angka latitude, gunakan koordinat di sekitar lokasi user>",
      "lon": <angka longitude, gunakan koordinat di sekitar lokasi user>,
      "address": "Alamat lengkap",
      "openingHours": "Jam buka (contoh: 08:00-22:00)",
      "reason": "Alasan kenapa tempat ini cocok dengan mood user (1 kalimat)",
      "estimatedBudget": "Estimasi budget (contoh: Rp 30.000 - Rp 60.000 atau Gratis)"
    }
  ]
}

Pastikan:
- Semua field terisi
- Koordinat lat/lon berupa ANGKA (bukan string) dan valid
- Kategori menggunakan salah satu dari daftar di atas
- Balas HANYA dengan JSON object, tanpa teks lain`,
        },
        {
          role: "user",
          content: mood,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const text = completion.choices[0].message.content || "{}";
    const parsed = extractJSON(text);
    const validated = validatePlaces(parsed);

    if (!validated) {
      throw new Error("Invalid AI response format");
    }

    const places = validated.places
      .map((p: unknown, i: number) => {
        const item = p as Record<string, unknown>;
        return {
          id: Date.now() + i,
          name: String(item.name || "Tanpa Nama"),
          description: String(item.description || ""),
          category: String(item.category || "cafe"),
          lat: Number(item.lat) || 0,
          lon: Number(item.lon) || 0,
          address: String(item.address || ""),
          openingHours: String(item.openingHours || ""),
          reason: String(item.reason || ""),
          estimatedBudget: String(item.estimatedBudget || ""),
        };
      })
      .filter(
        (p) => isFinite(p.lat) && isFinite(p.lon) && p.lat !== 0 && p.lon !== 0,
      );

    if (places.length === 0) throw new Error("No valid places from AI");

    return NextResponse.json({ places });
  } catch {
    const fallback = fallbackPlaces.map((p) => ({ ...p, id: Date.now() }));
    return NextResponse.json({ places: fallback });
  }
}
