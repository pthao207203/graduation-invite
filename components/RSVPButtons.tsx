"use client";

import { useState } from "react";

interface RSVPButtonsProps {
  uniqueCode: string;
  type: "event" | "lunch";
  currentStatus?: "pending" | "accepted" | "declined" | null;
  onUpdate?: (status: "accepted" | "declined") => void;
}

export default function RSVPButtons({
  uniqueCode,
  type,
  currentStatus,
  onUpdate,
}: RSVPButtonsProps) {
  const [status, setStatus] = useState<"accepted" | "declined" | null>(
    currentStatus === "pending"
      ? null
      : (currentStatus as "accepted" | "declined" | null),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRSVP = async (newStatus: "accepted" | "declined") => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: uniqueCode,
          type: type,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(newStatus);
        setMessage(
          newStatus === "accepted" ? "✓ Đã Chấp Nhận" : "✓ Đã Từ Chối",
        );
        if (onUpdate) onUpdate(newStatus);

        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch {
      setMessage("❌ Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === "event" ? "Lễ Tốt Nghiệp" : "Lời Mời Ăn Trưa";
  const icon = type === "event" ? "🎓" : "🍽️";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-semibold text-[#01443D]">{title}</h3>
      </div>

      <p className="text-center text-gray-600 mb-4">Bạn sẽ tham dự không?</p>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleRSVP("accepted")}
          disabled={isLoading || status === "accepted"}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${
              status === "accepted"
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {status === "accepted" ? "✓ Chấp Nhận" : "Chấp Nhận"}
        </button>

        <button
          onClick={() => handleRSVP("declined")}
          disabled={isLoading || status === "declined"}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${
              status === "declined"
                ? "bg-red-600 text-white shadow-lg scale-105"
                : "bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {status === "declined" ? "✗ Từ Chối" : "Từ Chối"}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {message && (
        <div
          className={`
          text-center mt-4 py-2 px-4 rounded-lg font-medium
          ${message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
        `}
        >
          {message}
        </div>
      )}
    </div>
  );
}
