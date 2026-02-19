import { NextRequest, NextResponse } from "next/server";
import { getGuestByCode, updateGuestRSVP } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, type, status } = body;

    // Validate input
    if (!code || !type || !status) {
      return NextResponse.json(
        { success: false, error: "Thiếu các trường bắt buộc" },
        { status: 400 },
      );
    }

    if (!["event", "lunch"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Loại không hợp lệ. Phải là "event" hoặc "lunch"',
        },
        { status: 400 },
      );
    }

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trạng thái không hợp lệ. Phải là "accepted" hoặc "declined"',
        },
        { status: 400 },
      );
    }

    // Get guest by code
    const guest = await getGuestByCode(code);

    if (!guest) {
      return NextResponse.json(
        { success: false, error: "Khách không tìm thấy" },
        { status: 404 },
      );
    }

    // Update RSVP
    const success = await updateGuestRSVP(
      guest.id,
      type as "event" | "lunch",
      status as "accepted" | "declined",
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Cập nhật RSVP thành công",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Không thể cập nhật RSVP" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("RSVP API error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ nội bộ" },
      { status: 500 },
    );
  }
}
