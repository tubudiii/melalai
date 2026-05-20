import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // ✅ nonaktifkan untuk kompatibilitas Leaflet
  images: {
    remotePatterns: [{ hostname: "tile.openstreetmap.org" }],
  },
};

export default nextConfig;
