"use client";

import { type Language } from "@/lib/translations";

interface HeroSectionProps {
  eventDate: Date;
  language?: Language;
}

export default function HeroSection({
  eventDate,
  language = "vi",
}: HeroSectionProps) {
  const formattedDate = eventDate.toLocaleDateString(
    language === "ja" ? "ja-JP" : "vi-VN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <section className="relative w-full h-screen min-h-150 flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: "url('/Ảnh 1.png')",
          backgroundPosition: "center 30%",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#01443D] opacity-70" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-3 drop-shadow-lg">
          Phương Thảo
        </h1>
        <p className="font-thin text-base md:text-2xl tracking-wide">
          — {formattedDate} —
        </p>
      </div>
    </section>
  );
}
