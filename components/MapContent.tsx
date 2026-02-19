"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { subscribeLiveLocation } from "@/lib/realtime";
import type { LiveLocation, EventConfig } from "@/lib/types";

// Fix default marker icons in Next.js
if (typeof window !== "undefined") {
  const iconDefault = L.Icon.Default.prototype as unknown as Record<
    string,
    string
  >;
  delete iconDefault._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

// Custom marker icons using Google Material Icons
const createIcon = (iconName: string, color: string, bgColor: string) =>
  new L.DivIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        background-color: ${bgColor};
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <span class="material-icons" style="
          color: ${color};
          font-size: 24px;
          transform: rotate(45deg);
        ">${iconName}</span>
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

interface MapSectionProps {
  eventConfig: EventConfig;
  showParking: boolean;
  showLunch: boolean;
}

export default function MapContent({
  eventConfig,
  showParking,
  showLunch,
}: MapSectionProps) {
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  // Create icons on client side only
  const icons =
    typeof window !== "undefined"
      ? {
          graduation: createIcon("school", "#0d9488", "#fff"),
          parking: createIcon("local_parking", "#0d9488", "#fff"),
          waitingRoom: createIcon("weekend", "#0d9488", "#fff"),
          photoSpot: createIcon("photo_camera", "#0d9488", "#fff"),
          lunch: createIcon("restaurant", "#ea580c", "#fed7aa"),
          live: createIcon("location_on", "#eab308", "#fef3c7"),
        }
      : null;

  useEffect(() => {
    if (eventConfig.liveMode) {
      const unsubscribe = subscribeLiveLocation((location) => {
        setLiveLocation(location);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [eventConfig.liveMode]);

  useEffect(() => {
    console.log("[MapContent] eventConfig", eventConfig);
    console.log("[MapContent] showParking/showLunch", {
      showParking,
      showLunch,
    });
  }, [eventConfig, showParking, showLunch]);

  const center: [number, number] = [
    eventConfig.graduationLocation.location.lat,
    eventConfig.graduationLocation.location.lng,
  ];

  if (typeof window === "undefined" || !icons) {
    return (
      <div className="w-full h-125 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Đang Tải Bản Đồ...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={18}
      scrollWheelZoom={false}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "0.5rem",
        zIndex: 1,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Graduation Location */}
      <Marker
        position={[
          eventConfig.graduationLocation.location.lat,
          eventConfig.graduationLocation.location.lng,
        ]}
        icon={icons.graduation}
      >
        <Popup>
          <strong>{eventConfig.graduationLocation.name}</strong>
          <br />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${eventConfig.graduationLocation.location.lat},${eventConfig.graduationLocation.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm"
          >
            Chỉ đường đến đây
          </a>
        </Popup>
      </Marker>

      {/* Parking Location */}
      {showParking && eventConfig.parkingLocation && (
        <Marker
          position={[
            eventConfig.parkingLocation.location.lat,
            eventConfig.parkingLocation.location.lng,
          ]}
          icon={icons.parking}
        >
          <Popup>
            <strong>{eventConfig.parkingLocation.name || "Bãi xe"}</strong>
            <br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${eventConfig.parkingLocation.location.lat},${eventConfig.parkingLocation.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm"
            >
              Chỉ đường đến đây
            </a>
          </Popup>
        </Marker>
      )}

      {/* Waiting Room */}
      {eventConfig.waitingRoom.enabled && (
        <Marker
          position={[eventConfig.waitingRoom.lat, eventConfig.waitingRoom.lng]}
          icon={icons.waitingRoom}
        >
          <Popup>
            <strong>{eventConfig.waitingRoom.name}</strong>
            <br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${eventConfig.waitingRoom.lat},${eventConfig.waitingRoom.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm"
            >
              Chỉ đường đến đây
            </a>
          </Popup>
        </Marker>
      )}

      {/* Photo Spot */}
      <Marker
        position={[
          eventConfig.photoSpot.location.lat,
          eventConfig.photoSpot.location.lng,
        ]}
        icon={icons.photoSpot}
      >
        <Popup>
          <strong>{eventConfig.photoSpot.name}</strong>
          <br />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${eventConfig.photoSpot.location.lat},${eventConfig.photoSpot.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm"
          >
            Chỉ đường đến đây
          </a>
        </Popup>
      </Marker>

      {/* Lunch Location */}
      {showLunch && eventConfig.lunchLocation && (
        <Marker
          position={[
            eventConfig.lunchLocation.location.lat,
            eventConfig.lunchLocation.location.lng,
          ]}
          icon={icons.lunch}
        >
          <Popup>
            <strong>{eventConfig.lunchLocation.name || "Phòng nghỉ"}</strong>
            <br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${eventConfig.lunchLocation.location.lat},${eventConfig.lunchLocation.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm"
            >
              Chỉ đường đến đây
            </a>
          </Popup>
        </Marker>
      )}

      {/* Live Location */}
      {eventConfig.liveMode && liveLocation && (
        <Marker
          position={[liveLocation.lat, liveLocation.lng]}
          icon={icons.live}
          eventHandlers={{
            click: () => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${liveLocation.lat},${liveLocation.lng}`,
                "_blank",
              );
            },
          }}
        >
          <Popup>
            <strong>Vị Trí Hiện Tại</strong>
            <p className="text-sm mt-1">
              Cập Nhật:{" "}
              {new Date(liveLocation.updatedAt).toLocaleTimeString("vi-VN")}
            </p>
            <p className="text-xs text-gray-600">
              Độ Cao: {liveLocation.altitude}m
            </p>
            <br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${liveLocation.lat},${liveLocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm"
            >
              Chỉ đường đến đây
            </a>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
