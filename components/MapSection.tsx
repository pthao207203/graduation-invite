"use client";

import dynamic from "next/dynamic";
import type { EventConfig } from "@/lib/types";

interface MapSectionProps {
  eventConfig: EventConfig;
  showParking: boolean;
  showLunch: boolean;
}

// Lazy load the map component to avoid server-side Leaflet initialization
const MapContent = dynamic<MapSectionProps>(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Đang Tải Bản Đồ...</p>
    </div>
  ),
});

export default function MapSection(props: MapSectionProps) {
  return <MapContent {...props} />;
}
