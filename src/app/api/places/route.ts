import { NextRequest, NextResponse } from "next/server";

const mockPlaces = [
  {
    id: 1,
    name: "Kopi Senja",
    category: "cafe",
    lat: -8.4095,
    lon: 115.1889,
    address: "Jl. Raya Ubud No. 12",
    openingHours: "08:00-22:00",
  },
  {
    id: 2,
    name: "Taman Kota",
    category: "park",
    lat: -8.41,
    lon: 115.19,
    address: "Jl. Ngurah Rai",
    openingHours: "06:00-18:00",
  },
  {
    id: 3,
    name: "Warung Bu Karjo",
    category: "restaurant",
    lat: -8.411,
    lon: 115.187,
    address: "Jl. Diponegoro No. 45",
    openingHours: "10:00-21:00",
  },
  {
    id: 4,
    name: "WorkHub Co-working",
    category: "cafe",
    lat: -8.408,
    lon: 115.191,
    address: "Jl. Gajah Mada No. 8",
    openingHours: "07:00-23:00",
  },
  {
    id: 5,
    name: "Perpustakaan Daerah",
    category: "library",
    lat: -8.412,
    lon: 115.186,
    address: "Jl. Pahlawan No. 1",
    openingHours: "08:00-20:00",
  },
  {
    id: 6,
    name: "Bioskop Grand",
    category: "cinema",
    lat: -8.407,
    lon: 115.192,
    address: "Jl. Sudirman No. 99",
    openingHours: "10:00-23:00",
  },
  {
    id: 7,
    name: "Warung Makan Sari",
    category: "restaurant",
    lat: -8.413,
    lon: 115.185,
    address: "Jl. Hasanuddin No. 22",
    openingHours: "07:00-22:00",
  },
  {
    id: 8,
    name: "Ruang Baca Komunitas",
    category: "library",
    lat: -8.409,
    lon: 115.189,
    address: "Jl. Merdeka No. 7",
    openingHours: "09:00-21:00",
  },
  {
    id: 9,
    name: "Taman Bunga",
    category: "park",
    lat: -8.4105,
    lon: 115.188,
    address: "Jl. Cokroaminoto",
    openingHours: "07:00-17:00",
  },
  {
    id: 10,
    name: "Kafe Literasi",
    category: "cafe",
    lat: -8.4115,
    lon: 115.1905,
    address: "Jl. Teuku Umar No. 33",
    openingHours: "08:00-23:00",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = searchParams.get("radius") || "1500";
  const category = searchParams.get("category") || "cafe|restaurant|bar";

  try {
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"~"${category}"](around:${radius},${lat},${lon});
      );
      out body;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!res.ok) throw new Error(`Overpass API returned ${res.status}`);

    const data = await res.json();

    type OverpassElement = {
      id: number;
      lat: number;
      lon: number;
      tags?: {
        name?: string;
        amenity?: string;
        "addr:street"?: string;
        opening_hours?: string;
      };
    };

    const places = (data.elements as OverpassElement[]).map((el) => ({
      id: el.id,
      name: el.tags?.name || "Tanpa Nama",
      category: el.tags?.amenity,
      lat: el.lat,
      lon: el.lon,
      address: el.tags?.["addr:street"] || "",
      openingHours: el.tags?.opening_hours || null,
    }));

    return NextResponse.json({ places });
  } catch {
    const categories = category.split("|");
    const filtered = mockPlaces.filter((p) => categories.includes(p.category));
    return NextResponse.json({ places: filtered });
  }
}
