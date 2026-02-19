"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getRoleById } from "@/lib/firestore";
import { getTranslation, type Language } from "@/lib/translations";
import type { Role } from "@/lib/types";

interface ThankYouSectionProps {
  roleId?: string;
  language: Language;
}

export default function ThankYouSection({
  roleId,
  language,
}: ThankYouSectionProps) {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (roleId) {
      getRoleById(roleId).then((loadedRole) => {
        if (loadedRole) {
          setRole(loadedRole);
        }
      });
    }
  }, [roleId]);

  const t = getTranslation(language);
  const toGuest = role?.toGuest || "bạn";
  const toHost = role?.toHost || "mình";
  return (
    <section
      className="w-full py-8 md:py-20 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/section4.png')" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Photo with Brush Border */}
        <div className="relative inline-block mb-8">
          {/* Brush stroke SVG border */}
          <svg
            className="absolute inset-0 w-full h-full -m-4"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="#01443D"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="3 8"
              opacity="0.7"
            />
          </svg>

          {/* Image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
            <Image
              src="/Ảnh 2.png"
              alt="Phương Thảo"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Thank You Text */}
        <h2 className="font-display text-4xl md:text-7xl text-[#01443D] mb-6">
          {t.thankYouTitle}
        </h2>

        <p className="font-body text-lg text-[#01443D] max-w-2xl mx-auto">
          {t.thankYouParagraph1
            .replace("{toGuest}", toGuest)
            .replace("{toHost}", toHost)}
        </p>
        {/* <p className="font-body text-lg text-[#01443D] max-w-xl mx-auto mt-4">
          {t.thankYouParagraph2.replace("{toGuest}", toGuest)}
        </p> */}
      </div>
    </section>
  );
}
