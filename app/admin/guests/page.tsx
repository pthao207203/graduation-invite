"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllGuests,
  getAllRoles,
  createGuest,
  updateGuest,
  deleteGuest,
} from "@/lib/firestore";
import type { Guest, Role } from "@/lib/types";

type FilterType = "all" | "accepted" | "declined" | "pending";
type FilterCategory = "event" | "lunch";

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("event");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    uniqueCode: "",
    name: "",
    roleId: "",
    language: "vi" as "vi" | "ja",
    needParkingMap: false,
    inviteLunch: false,
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [guestsData, rolesData] = await Promise.all([
        getAllGuests(),
        getAllRoles(),
      ]);
      console.log("Loaded roles:", rolesData);
      setGuests(guestsData);
      setRoles(rolesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Helper function to get role name from roleId
  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "";
  };

  const filteredGuests = useMemo(() => {
    let filtered = [...guests];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.uniqueCode.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (filterType !== "all") {
      filtered = filtered.filter((guest) => {
        const status =
          filterCategory === "event" ? guest.rsvpStatus : guest.lunchStatus;
        return status === filterType;
      });
    }

    // Sort by createdAt (newest first)
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    return filtered;
  }, [guests, searchQuery, filterType, filterCategory]);

  const loadGuests = async () => {
    const data = await getAllGuests();
    setGuests(data);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createGuest({
      ...formData,
      language: (formData.language as "vi" | "ja") || "vi",
    });

    if (result.success) {
      showMessage("✓ Đã thêm khách mời thành công");
      setShowAddModal(false);
      resetForm();
      loadGuests();
    } else {
      showMessage(`❌ ${result.error || "Không thể thêm khách mời"}`);
    }
  };

  const handleEditGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    const success = await updateGuest(editingGuest.id, {
      name: formData.name,
      roleId: formData.roleId,
      language: (formData.language as "vi" | "ja") || "vi",
      needParkingMap: formData.needParkingMap,
      inviteLunch: formData.inviteLunch,
    });

    if (success) {
      showMessage("✓ Đã cập nhật khách mời thành công");
      setShowEditModal(false);
      setEditingGuest(null);
      resetForm();
      loadGuests();
    } else {
      showMessage("❌ Không thể cập nhật khách mời");
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách mời "${guestName}"?`)) {
      return;
    }

    const success = await deleteGuest(guestId);
    if (success) {
      showMessage("✓ Đã xóa khách mời thành công");
      loadGuests();
    } else {
      showMessage("❌ Không thể xóa khách mời");
    }
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      uniqueCode: guest.uniqueCode,
      name: guest.name,
      roleId: guest.roleId || "",
      language: guest.language || "vi",
      needParkingMap: guest.needParkingMap,
      inviteLunch: guest.inviteLunch,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      uniqueCode: "",
      name: "",
      roleId: "",
      language: "vi",
      needParkingMap: false,
      inviteLunch: false,
    });
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCopyLink = async (uniqueCode: string) => {
    const inviteUrl = `${window.location.origin}/invite/${uniqueCode}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      showMessage("✓ Đã copy link mời vào clipboard");
    } catch {
      showMessage("❌ Không thể copy link");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
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

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-teal-700 hover:text-[#01443D] font-medium"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại trang chính
            </Link>
            <button
              onClick={handleLogout}
              className="ml-auto inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              title="Đăng xuất"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#01443D] mb-2">
                Quản Lý Khách Mời
              </h1>
              <p className="text-base md:text-lg text-[#01443D] opacity-80">
                Tổng cộng {guests.length} khách mời
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
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
              Thêm Khách Mời
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

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#01443D] mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Filter Category */}
            <div>
              <label className="block text-sm font-medium text-[#01443D] mb-2">
                Loại phản hồi
              </label>
              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value as FilterCategory)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="event">Lễ tốt nghiệp</option>
                <option value="lunch">Bữa trưa</option>
              </select>
            </div>

            {/* Filter Type */}
            <div>
              <label className="block text-sm font-medium text-[#01443D] mb-2">
                Trạng thái
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="accepted">Đã xác nhận</option>
                <option value="declined">Đã từ chối</option>
                <option value="pending">Chưa phản hồi</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-[#01443D] opacity-70">
            Hiển thị {filteredGuests.length} khách mời
          </div>
        </div>

        {/* Guest Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Phản hồi Lễ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Mời Ăn Trưa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Phản hồi Trưa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Bãi Xe
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#01443D] uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#01443D]">
                          {guest.name}
                        </div>
                        {guest.roleId && (
                          <div className="text-xs text-[#01443D] opacity-60">
                            {getRoleName(guest.roleId)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <code className="bg-gray-100 px-2 py-1 rounded text-[#01443D]">
                        {guest.uniqueCode}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#01443D]">
                      {guest.inviteLunch ? (
                        <span className="text-green-600 font-medium">✓ Có</span>
                      ) : (
                        <span className="text-gray-400">✗ Không</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {guest.inviteLunch ? (
                        <>
                          {guest.lunchStatus === "accepted" && (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                              Đã xác nhận
                            </span>
                          )}
                          {guest.lunchStatus === "declined" && (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                              Đã từ chối
                            </span>
                          )}
                          {guest.lunchStatus === "pending" && (
                            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                              Chưa phản hồi
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#01443D]">
                      {guest.needParkingMap ? (
                        <span className="text-green-600 font-medium">✓ Có</span>
                      ) : (
                        <span className="text-gray-400">✗ Không</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyLink(guest.uniqueCode)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Copy link mời"
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <a
                          href={`/invite/${guest.uniqueCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-[#01443D] font-medium"
                          title="Xem lời mời"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>
                        <button
                          onClick={() => openEditModal(guest)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Chỉnh sửa"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteGuest(guest.id, guest.name)
                          }
                          className="text-red-600 hover:text-red-800"
                          title="Xóa"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGuests.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-[#01443D] opacity-60">
                Không tìm thấy khách mời nào
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-teal-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#01443D] mb-4">
                Thêm Khách Mời Mới
              </h2>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Mã khách mời <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.uniqueCode}
                    onChange={(e) =>
                      setFormData({ ...formData, uniqueCode: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="VD: GUEST001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Tên khách mời <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Vai trò / Quan hệ
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) =>
                      setFormData({ ...formData, roleId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} ({role.toGuest} / {role.toHost})
                      </option>
                    ))}
                  </select>
                  {roles.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ Chưa có roles. Vui lòng vào{" "}
                      <a
                        href="/admin/setup"
                        target="_blank"
                        className="underline font-medium"
                      >
                        trang Setup
                      </a>{" "}
                      để tạo roles.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Ngôn ngữ
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value as "vi" | "ja",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="ja">日本語 (Tiếng Nhật)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.needParkingMap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          needParkingMap: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-[#01443D]">
                      Cần bản đồ bãi xe
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inviteLunch}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inviteLunch: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-[#01443D]">Mời ăn trưa</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-[#01443D] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-700 hover:bg-[#01443D] text-white rounded-lg transition-colors font-medium"
                  >
                    {editingGuest ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Guest Modal */}
      {showEditModal && editingGuest && (
        <div className="fixed inset-0 bg-teal-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#01443D] mb-4">
                Chỉnh Sửa Khách Mời
              </h2>
              <form onSubmit={handleEditGuest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Mã khách mời
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.uniqueCode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-[#01443D] opacity-60 mt-1">
                    Mã khách mời không thể thay đổi
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Tên khách mời <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Vai trò / Quan hệ
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) =>
                      setFormData({ ...formData, roleId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} ({role.toGuest} / {role.toHost})
                      </option>
                    ))}
                  </select>
                  {roles.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ Chưa có roles. Vui lòng vào{" "}
                      <a
                        href="/admin/setup"
                        target="_blank"
                        className="underline font-medium"
                      >
                        trang Setup
                      </a>{" "}
                      để tạo roles.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#01443D] mb-1">
                    Ngôn ngữ
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value as "vi" | "ja",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="ja">日本語 (Tiếng Nhật)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.needParkingMap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          needParkingMap: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-[#01443D]">
                      Cần bản đồ bãi xe
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inviteLunch}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inviteLunch: e.target.checked,
                        })
                      }
                      className="w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-[#01443D]">Mời ăn trưa</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingGuest(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-[#01443D] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-700 hover:bg-[#01443D] text-white rounded-lg transition-colors"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
