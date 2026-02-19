"use client";

import dynamic from "next/dynamic";
import type { EventConfig } from "@/lib/types";

interface DirectionsSectionProps {
  eventConfig: EventConfig;
  showParking: boolean;
  showLunch: boolean;
}

interface MapContentProps {
  eventConfig: EventConfig;
  showParking: boolean;
  showLunch: boolean;
}

const MapContent = dynamic<MapContentProps>(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Đang Tải Bản Đồ...</p>
    </div>
  ),
});

export default function DirectionsSection({
  eventConfig,
  showParking,
  showLunch,
}: DirectionsSectionProps) {
  return (
    <section className="w-full py-8 md:py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-0">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-6xl text-center text-[#01443D] mb-8 md:mb-12">
          Hướng dẫn
        </h2>

        {/* Map */}
        <div className="mb-12 border-4 border-teal-700 overflow-hidden relative z-0">
          <MapContent
            eventConfig={eventConfig}
            showParking={showParking}
            showLunch={showLunch}
          />
        </div>

        {/* Location Icons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {/* Graduation Hall */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full border-2 border-teal-700 flex items-center justify-center">
              <span className="material-icons text-teal-700">school</span>
            </div>
            <div>
              <h3 className="font-body font-semibold text-[#01443D] mb-1">
                {eventConfig.graduationLocation.name}
              </h3>
              <p className="font-body text-sm text-gray-600">
                Địa điểm diễn ra buổi lễ tốt nghiệp chính thức
              </p>
            </div>
          </div>

          {/* Parking */}
          {showParking && (
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full border-2 border-teal-700 flex items-center justify-center">
                <span className="material-icons text-teal-700">
                  local_parking
                </span>
              </div>
              <div>
                <h3 className="font-body font-semibold text-[#01443D] mb-1">
                  {eventConfig.parkingLocation.name}
                </h3>
                <p className="font-body text-sm text-gray-600">
                  Khu vực dành cho khách gửi xe máy
                </p>
              </div>
            </div>
          )}

          {/* Photo Spot */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full border-2 border-teal-700 flex items-center justify-center">
              <span className="material-icons text-teal-700">photo_camera</span>
            </div>
            <div>
              <h3 className="font-body font-semibold text-[#01443D] mb-1">
                {eventConfig.photoSpot.name}
              </h3>
              <p className="font-body text-sm text-gray-600">
                Không gian decor để chụp ảnh lưu niệm
              </p>
            </div>
          </div>

          {/* Lunch Room */}

          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full border-2 border-teal-700 flex items-center justify-center">
              <span className="material-icons text-teal-700">weekend</span>
            </div>
            <div>
              <h3 className="font-body font-semibold text-[#01443D] mb-1">
                {eventConfig.waitingRoom.name}
              </h3>
              <p className="font-body text-sm text-gray-600">
                Khu vực nghỉ ngơi dành cho khách mời
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
