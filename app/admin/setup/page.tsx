"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DEFAULT_ROLES = [
  {
    name: "honey",
    toGuest: "anh",
    toHost: "em",
  },
  {
    name: "friend",
    toGuest: "bạn",
    toHost: "mình",
  },
  {
    name: "old-brother",
    toGuest: "anh",
    toHost: "em",
  },
  {
    name: "old-sister",
    toGuest: "chị",
    toHost: "em",
  },
  {
    name: "young-brother",
    toGuest: "em",
    toHost: "chị",
  },
  {
    name: "young-sister",
    toGuest: "em",
    toHost: "chị",
  },
];

export default function SetupPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const seedRoles = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Check if roles already exist
      const rolesRef = collection(db, "role");
      const snapshot = await getDocs(rolesRef);

      if (!snapshot.empty) {
        setMessage(
          `⚠️ Đã có ${snapshot.size} role trong database. Không thể seed lại.`,
        );
        setIsLoading(false);
        return;
      }

      // Add each role
      let count = 0;
      for (const role of DEFAULT_ROLES) {
        await addDoc(rolesRef, role);
        count++;
      }

      setMessage(`✅ Đã tạo ${count} roles thành công!`);
    } catch (error) {
      console.error("Error seeding roles:", error);
      setMessage("❌ Lỗi khi tạo roles: " + (error as Error).message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-teal-700 hover:text-[#01443D] font-medium"
          >
            ← Quay lại Admin
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#01443D] mb-6">
            Cài Đặt Hệ Thống
          </h1>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#01443D] mb-4">
              Khởi tạo Roles
            </h2>
            <p className="text-[#01443D] opacity-70 mb-4">
              Tạo các vai trò mặc định với cách xưng hô phù hợp cho lời mời. Chỉ
              cần chạy một lần duy nhất khi thiết lập lần đầu.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-[#01443D] mb-3">
                6 Roles sẽ được tạo:
              </h3>
              <div className="space-y-2">
                {DEFAULT_ROLES.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between bg-white p-3 rounded"
                  >
                    <span className="font-medium text-[#01443D]">
                      {role.name}
                    </span>
                    <span className="text-sm text-[#01443D] opacity-60">
                      Xưng hô: <strong>{role.toGuest}</strong> / Tự xưng:{" "}
                      <strong>{role.toHost}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={seedRoles}
              disabled={isLoading}
              className="w-full bg-teal-700 hover:bg-[#01443D] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang tạo roles..." : "Tạo Roles"}
            </button>

            {message && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-800"
                    : message.startsWith("⚠️")
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold text-[#01443D] mb-2">Hướng dẫn:</h3>
            <ol className="list-decimal list-inside space-y-2 text-[#01443D] opacity-70">
              <li>
                Nhấn nút &quot;Tạo Roles&quot; để khởi tạo 6 vai trò mặc định
              </li>
              <li>Sau khi tạo xong, bạn có thể thêm khách mời với role</li>
              <li>
                Các role này dùng để cá nhân hóa lời mời với cách xưng hô phù
                hợp
              </li>
              <li>Chỉ cần chạy một lần, không thể seed lại nếu đã có roles</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
