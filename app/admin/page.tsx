"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllGuests,
  getEventConfig,
  updateEventConfig,
  subscribeToGuestChanges,
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAllNotifications,
  type Notification,
} from "@/lib/firestore";
import { getTranslation } from "@/lib/translations";
import type { Guest, EventConfig } from "@/lib/types";

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      const [guestsData, configData, notificationsData] = await Promise.all([
        getAllGuests(),
        getEventConfig(),
        getAllNotifications(),
      ]);

      if (isMounted) {
        setGuests(guestsData);
        setEventConfig(configData);
        setNotifications(notificationsData);
        setIsLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time notification changes
    const unsubscribe = subscribeToNotifications((newNotifications) => {
      if (isMounted) {
        setNotifications(newNotifications);
      }
    });

    // Initialize guest change listener (to save new notifications)
    const unsubscribeGuests = subscribeToGuestChanges(() => {
      // This will auto-save notifications to Firestore
    });

    return () => {
      isMounted = false;
      unsubscribe();
      unsubscribeGuests();
    };
  }, []);

  const toggleWaitingRoom = async () => {
    if (!eventConfig) return;

    const updated = await updateEventConfig({
      ...eventConfig,
      waitingRoom: {
        ...eventConfig.waitingRoom,
        enabled: !eventConfig.waitingRoom.enabled,
      },
    });

    if (updated) {
      setEventConfig({
        ...eventConfig,
        waitingRoom: {
          ...eventConfig.waitingRoom,
          enabled: !eventConfig.waitingRoom.enabled,
        },
      });
      showMessage("✓ Phòng chờ đã cập nhật");
    } else {
      showMessage("❌ Cập nhật phòng chờ thất bại");
    }
  };

  const toggleLiveMode = async () => {
    if (!eventConfig) return;

    const updated = await updateEventConfig({
      ...eventConfig,
      liveMode: !eventConfig.liveMode,
    });

    if (updated) {
      setEventConfig({
        ...eventConfig,
        liveMode: !eventConfig.liveMode,
      });
      showMessage("✓ Chế độ trực tiếp đã cập nhật");
    } else {
      showMessage("❌ Cập nhật chế độ trực tiếp thất bại");
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const calculateStats = () => {
    const eventAccepted = guests.filter(
      (g) => g.rsvpStatus === "accepted",
    ).length;
    const eventDeclined = guests.filter(
      (g) => g.rsvpStatus === "declined",
    ).length;
    const eventPending = guests.filter(
      (g) => g.rsvpStatus === "pending",
    ).length;

    const lunchInvited = guests.filter((g) => g.inviteLunch).length;
    const lunchAccepted = guests.filter(
      (g) => g.lunchStatus === "accepted",
    ).length;
    const lunchDeclined = guests.filter(
      (g) => g.lunchStatus === "declined",
    ).length;
    const lunchPending = guests.filter(
      (g) => g.inviteLunch && g.lunchStatus === "pending",
    ).length;

    return {
      total: guests.length,
      event: {
        accepted: eventAccepted,
        declined: eventDeclined,
        pending: eventPending,
      },
      lunch: {
        invited: lunchInvited,
        accepted: lunchAccepted,
        declined: lunchDeclined,
        pending: lunchPending,
      },
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 via-white to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01443D] mx-auto mb-4"></div>
          <p className="text-[#01443D] font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-6xl font-bold text-[#01443D] mb-2">
                Quản Trị Sự Kiện
              </h1>
              <p className="text-base md:text-lg text-[#01443D] opacity-80">
                Quản lý lời mời tốt nghiệp và cài đặt sự kiện
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              title="Đăng xuất"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`
            mb-6 py-3 px-6 rounded-lg font-medium text-center shadow-md
            ${message.includes("✓") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}
          `}
          >
            {message}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#01443D]">
              Thống Kê Lễ Tốt Nghiệp
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-teal-700 mb-1">
                {stats.total}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Tổng Số Khách
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                {stats.event.accepted}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Đã Xác Nhận
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">
                {stats.event.declined}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Đã Từ Chối
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1">
                {stats.event.pending}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Chưa Phản Hồi
              </div>
            </div>
          </div>
        </div>

        {/* Lunch Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#01443D] mb-4">
            Thống Kê Bữa Trưa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
                {stats.lunch.invited}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Được Mời
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                {stats.lunch.accepted}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Đã Xác Nhận
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">
                {stats.lunch.declined}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Đã Từ Chối
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1">
                {stats.lunch.pending}
              </div>
              <div className="text-xs md:text-sm text-[#01443D] opacity-70">
                Chưa Phản Hồi
              </div>
            </div>
          </div>
        </div>

        {/* Settings Controls */}
        {eventConfig && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#01443D] mb-6">
              Cài Đặt Sự Kiện
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-6 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-[#01443D] text-lg mb-1">
                    Phòng Chờ
                  </h3>
                  <p className="text-sm text-[#01443D] opacity-70">
                    Hiển thị điểm đánh dấu phòng chờ trên bản đồ
                  </p>
                </div>
                <button
                  onClick={toggleWaitingRoom}
                  className={`
                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                    ${eventConfig.waitingRoom.enabled ? "bg-teal-600" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform
                      ${eventConfig.waitingRoom.enabled ? "translate-x-7" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#01443D] text-lg mb-1">
                    Chế Độ Trực Tiếp
                  </h3>
                  <p className="text-sm text-[#01443D] opacity-70">
                    Hiển thị theo dõi vị trí thực tế
                  </p>
                </div>
                <button
                  onClick={toggleLiveMode}
                  className={`
                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                    ${eventConfig.liveMode ? "bg-teal-600" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform
                      ${eventConfig.liveMode ? "translate-x-7" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Setup Quick Access */}
        {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#01443D] mb-2">
                Cài Đặt Hệ Thống
              </h2>
              <p className="text-sm md:text-base text-[#01443D] opacity-70">
                Khởi tạo dữ liệu cơ bản (roles, cấu hình)
              </p>
            </div>
            <Link
              href="/admin/setup"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Cài Đặt
            </Link>
          </div>
          <p className="text-sm text-[#01443D] opacity-60 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            💡 <strong>Lưu ý:</strong> Chỉ cần chạy setup một lần khi khởi tạo
            hệ thống lần đầu để tạo các roles mặc định.
          </p>
        </div> */}

        {/* Guest Management Quick Access */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#01443D] mb-2">
                Quản Lý Khách Mời
              </h2>
              <p className="text-sm md:text-base text-[#01443D] opacity-70">
                Xem, thêm, sửa và xóa danh sách khách mời
              </p>
            </div>
            <Link
              href="/admin/guests"
              className="inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-[#01443D] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Quản Lý Khách Mời
            </Link>
          </div>

          {/* Recent Guests Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-[#01443D] mb-4">
              Khách Mời Gần Đây
            </h3>
            <div className="space-y-3">
              {guests.slice(0, 5).map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#01443D]">{guest.name}</p>
                    <p className="text-sm text-[#01443D] opacity-60">
                      Mã: {guest.uniqueCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {guest.rsvpStatus === "accepted" && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Đã xác nhận
                      </span>
                    )}
                    {guest.rsvpStatus === "declined" && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                        Đã từ chối
                      </span>
                    )}
                    {guest.rsvpStatus === "pending" && (
                      <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                        Chưa phản hồi
                      </span>
                    )}
                    <a
                      href={`/invite/${guest.uniqueCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:text-[#01443D] text-sm font-medium"
                    >
                      Xem lời mời →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {guests.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  href="/admin/guests"
                  className="text-teal-700 hover:text-[#01443D] font-medium"
                >
                  Xem tất cả {guests.length} khách mời →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#01443D]">
              {getTranslation("vi").notificationRecentActivity}
            </h2>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-6 h-6 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                {notifications.filter((n) => !n.isRead).length}
              </div>
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={async () => {
                    await markAllNotificationsAsRead();
                    showMessage("✓ Đã đánh dấu tất cả là đã đọc");
                  }}
                  className="px-3 py-1.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-lg hover:bg-teal-200 transition-colors"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                {getTranslation("vi").notificationNoActivity}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Xác nhận từ khách sẽ xuất hiện tại đây
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={`${notif.notificationId}-${notif.timestamp}`}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    notif.isRead
                      ? "border-gray-100 bg-gradient-to-r from-gray-50 to-transparent"
                      : "border-teal-200 bg-gradient-to-r from-teal-100 to-transparent shadow-sm"
                  } hover:shadow-md`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {notif.status === "accepted" ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className={`text-sm font-medium text-[#01443D] ${
                          !notif.isRead ? "font-bold" : ""
                        }`}
                      >
                        {notif.type === "event"
                          ? notif.status === "accepted"
                            ? `✓ ${notif.guestName} ${getTranslation("vi").notificationAccepted}`
                            : `✗ ${notif.guestName} ${getTranslation("vi").notificationDeclined}`
                          : notif.status === "accepted"
                            ? `✓ ${notif.guestName} ${getTranslation("vi").notificationLunchAccepted}`
                            : `✗ ${notif.guestName} ${getTranslation("vi").notificationLunchDeclined}`}
                      </p>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      )}
                    </div>
                    <p className="text-xs text-[#01443D] opacity-60">
                      {new Date(notif.timestamp).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (!notif.isRead) {
                        await markNotificationAsRead(notif.notificationId);
                      }
                    }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      notif.isRead
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                    }`}
                    title={notif.isRead ? "Đã đọc" : "Đánh dấu là đã đọc"}
                  >
                    {notif.isRead ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Đã đọc
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803c1.753-2.964 4.953-4.972 8.5-4.972s6.747 2.008 8.5 4.972a9.97 9.97 0 011.563 4.803c-1.275 4.057-5.065 7-9.543 7M5 12a7 7 0 1114 0 7 7 0 01-14 0z"
                          />
                        </svg>
                        Chưa đọc
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-linear-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <svg
                className="w-8 h-8 text-teal-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#01443D] mb-2">
                Hướng Dẫn Sử Dụng
              </h3>
              <div className="text-sm text-[#01443D] opacity-80 space-y-2">
                <p>
                  • Sử dụng trang{" "}
                  <Link
                    href="/admin/guests"
                    className="font-medium text-teal-700 hover:underline"
                  >
                    Quản Lý Khách Mời
                  </Link>{" "}
                  để thêm, sửa, xóa khách mời
                </p>
                <p>• Mỗi khách mời sẽ có một mã duy nhất để truy cập lời mời</p>
                <p>
                  • Bật/tắt các tính năng như phòng chờ và chế độ trực tiếp ở
                  phần Cài Đặt
                </p>
                <p>
                  • Thống kê sẽ được cập nhật tự động khi khách mời phản hồi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
