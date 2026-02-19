"use client";

import { useState, useEffect } from "react";
import { getRoleById } from "@/lib/firestore";
import type { Role } from "@/lib/types";

interface InvitationSectionProps {
  guestName: string;
  uniqueCode: string;
  eventStatus: "pending" | "accepted" | "declined";
  eventDate: number;
  roleId?: string;
}

export default function InvitationSection({
  guestName,
  uniqueCode,
  eventStatus,
  eventDate,
  roleId,
}: InvitationSectionProps) {
  const [status, setStatus] = useState<"accepted" | "declined" | null>(
    eventStatus === "pending" ? null : (eventStatus as "accepted" | "declined"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Helper function to capitalize first letter
  const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Format event date
  const date = new Date(eventDate);
  const dayOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ][date.getDay()];
  const formattedTime = `${date.getHours().toString().padStart(2, "0")}h${date.getMinutes().toString().padStart(2, "0")}`;
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;

  // Load role data
  useEffect(() => {
    const loadRole = async () => {
      if (roleId) {
        const roleData = await getRoleById(roleId);
        setRole(roleData);
      }
    };
    loadRole();
  }, [roleId]);

  // Pronouns with defaults
  const toGuest = role?.toGuest || "bạn"; // How to address guest
  const toHost = role?.toHost || "mình"; // How guest refers to host
  const ToHost = capitalize(toHost); // Capitalized version for start of sentence

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = eventDate - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const handleRSVP = async (newStatus: "accepted" | "declined") => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: uniqueCode,
          type: "event",
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("RSVP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // June 2026 calendar data
  const daysInMonth = [
    { day: null },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8, highlight: true },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
  ];

  return (
    <section
      className="relative w-full py-8 md:py-20 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/section2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Invitation Text */}
          <div className="p-4 md:p-8 bg-white flex">
            <div className="flex-1 flex flex-col justify-center rounded-none shadow-lg p-4 md:p-8 border-4 border-teal-700">
              <h2 className="font-body text-[#01443D] text-sm md:text-base mb-3 md:mb-6">
                Thân gửi <span className="font-semibold">{guestName}</span>,
              </h2>

              <div className="space-y-2 md:space-y-4 text-[#01443D] font-body text-sm md:text-base leading-relaxed mb-4 md:mb-8">
                <p>
                  Sau những năm tháng học tập và cố gắng, cuối cùng {toHost}{" "}
                  cũng đã đến ngày tốt nghiệp. Đây là một cột mốc quan trọng
                  trong cuộc đời, và {toHost} rất mong được chia sẻ niềm vui này
                  cùng {toGuest}.
                </p>

                <p>
                  {ToHost} trân trọng kính mời {toGuest} tham dự buổi lễ tốt
                  nghiệp của {toHost}.
                </p>

                <div className="pt-2 md:pt-4 space-y-1 md:space-y-2 text-sm md:text-base">
                  <p>
                    Thời gian:{" "}
                    <span className="font-semibold">
                      {formattedTime}, {dayOfWeek}, ngày {formattedDate}
                    </span>
                  </p>
                  <p>
                    Địa điểm:{" "}
                    <span className="font-semibold">
                      Trường ĐH Công nghệ Thông tin, ĐHQG-HCM
                    </span>
                  </p>
                </div>
              </div>

              {/* RSVP Buttons */}
              <div className="flex gap-2 md:gap-4">
                <button
                  onClick={() => handleRSVP("accepted")}
                  disabled={isLoading || status === "accepted"}
                  className={`
                    flex-1 py-2 md:py-3 text-sm md:text-base font-body font-semibold transition-all
                    ${
                      status === "accepted"
                        ? "bg-teal-700 text-white"
                        : "bg-teal-700 text-white hover:bg-teal-800"
                    }
                    disabled:opacity-50
                  `}
                >
                  Tham gia
                </button>

                <button
                  onClick={() => handleRSVP("declined")}
                  disabled={isLoading || status === "declined"}
                  className={`
                    flex-1 py-2 md:py-3 text-sm md:text-base font-body font-semibold transition-all
                    ${
                      status === "declined"
                        ? "bg-gray-400 text-white"
                        : "bg-gray-300 text-[#01443D] hover:bg-gray-400 hover:text-white"
                    }
                    disabled:opacity-50
                  `}
                >
                  Từ chối
                </button>
              </div>
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="p-4 md:p-8 bg-white flex">
            <div className="flex-1 flex flex-col justify-center rounded-none shadow-lg p-3 md:p-8 border-4 border-teal-700">
              <h3 className="font-body text-[#01443D] font-semibold text-center text-sm md:text-base mb-3 md:mb-6">
                THÁNG 6/2026
              </h3>

              {/* Calendar Grid */}
              <div className="mb-2 md:mb-8">
                <div className="grid grid-cols-7 gap-x-1 gap-y-0 mb-2 border-t border-b border-teal-700 py-2 ">
                  {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                    <div
                      key={day}
                      className="w-8 text-center font-body font-semibold text-sm text-teal-800"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-x-1 gap-y-0">
                  {daysInMonth.map((item, index) => (
                    <div
                      key={index}
                      className={`
                      h-8 w-8 mx-auto flex items-center justify-center text-sm font-body
                      ${
                        item.highlight
                          ? "bg-teal-700 text-white rounded-full font-bold"
                          : item.day
                            ? "text-[#01443D]"
                            : ""
                      }
                    `}
                    >
                      {item.day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-center border-t border-teal-700 pt-3 md:pt-6">
                <div>
                  <div className="font-display text-3xl md:text-6xl text-teal-700">
                    {timeLeft.days}
                  </div>
                  <div className="font-body text-[10px] md:text-sm text-gray-600">
                    Ngày
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl md:text-6xl text-teal-700">
                    {timeLeft.hours}
                  </div>
                  <div className="font-body text-[10px] md:text-sm text-gray-600">
                    Giờ
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl md:text-6xl text-teal-700">
                    {timeLeft.minutes}
                  </div>
                  <div className="font-body text-[10px] md:text-sm text-gray-600">
                    Phút
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl md:text-6xl text-teal-700">
                    {timeLeft.seconds}
                  </div>
                  <div className="font-body text-[10px] md:text-sm text-gray-600">
                    Giây
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
