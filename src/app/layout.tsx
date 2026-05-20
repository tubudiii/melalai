import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Penjelajah Tempat Lokal — Temukan tempat sesuai moodmu",
  description:
    "Cari kafe, restoran, dan tempat menarik di sekitarmu dengan bantuan AI. Cukup tuliskan suasana hati atau mood kamu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-50 text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
