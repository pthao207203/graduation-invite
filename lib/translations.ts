export const translations = {
  vi: {
    // Header
    headerTitle: "Chúc mừng tốt nghiệp!",
    headerSubtitle1:
      "Hành trình học vấn đã kết thúc, một chặng đường mới đang bắt đầu.",
    headerSubtitle2:
      "Hãy cùng chia sẻ niềm vui trong ngày đặc biệt này với Phương Thảo nhé!",

    // Invitation Section
    invitationGreeting: "Kính gửi",
    invitationParagraph1:
      "Sau những năm tháng học tập và cố gắng, cuối cùng {toHost} cũng đã đến ngày tốt nghiệp. Đây là một cột mốc quan trọng trong cuộc đời, và {toHost} rất mong được chia sẻ niềm vui này cùng {toGuest}.",
    invitationParagraph2:
      "{ToHost} trân trọng kính mời {toGuest} tham dự buổi lễ tốt nghiệp của {toHost}.",
    invitationTime: "Thời gian:",
    invitationLocation: "Địa điểm:",
    invitationVenue: "Trường ĐH Công nghệ Thông tin, ĐHQG-HCM",

    // RSVP
    rsvpAccept: "Tham gia",
    rsvpDecline: "Từ chối",
    rsvpAcceptedTitle: "Thành công!",
    rsvpDeclinedTitle: "Thành công!",
    rsvpAcceptedMessage: "Bạn đã xác nhận sẽ tham dự lễ tốt nghiệp.",
    rsvpDeclinedMessage: "Bạn đã từ chối sẽ tham dự lễ tốt nghiệp.",
    rsvpClose: "Đóng",
    rsvpChangeMindNote:
      "Nếu bạn đổi ý, có thể nhấn “Tham gia” để xác nhận lại nhé.",

    // Countdown
    countdownDays: "Ngày",
    countdownHours: "Giờ",
    countdownMinutes: "Phút",
    countdownSeconds: "Giây",

    // Thank You Section
    thankYouTitle: "Xin cảm ơn",
    thankYouParagraph1:
      "Cảm ơn {toGuest} đã dành thời gian tham dự và chia sẻ niềm vui trong ngày đặc biệt này!",
    thankYouParagraph2: "Những khoảnh khắc cùng {toGuest} là kỷ niệm vô giá!",

    // Directions
    directionsTitle: "Hướng Dẫn Đường Đi",
    directionsSubtitle: "Nhân Điểm Quan Trọng",
    graduationVenue: "Địa điểm lễ tốt nghiệp",
    parkingArea: "Bãi đỗ xe",
    lunchVenue: "Nhà hàng ăn trưa",

    // Map
    mapLoading: "Đang Tải Bản Đồ...",
    mapDirections: "Chỉ đường đến đây",
    mapCurrentLocation: "Vị Trí Hiện Tại",
    mapUpdated: "Cập Nhật:",
    mapAltitude: "Độ Cao:",

    // Notifications
    notificationAccepted: " đã xác nhận tham dự",
    notificationDeclined: " đã từ chối tham dự",
    notificationLunchAccepted: " đã xác nhận ăn trưa",
    notificationLunchDeclined: " đã từ chối ăn trưa",
    notificationRecentActivity: "Hoạt Động Gần Đây",
    notificationNoActivity: "Chưa có xác nhận nào",
  },
  ja: {
    // Header
    headerTitle: "ご卒業おめでとうございます！",
    headerSubtitle1: "学びの旅が終わり、新しい道が始まります。",
    headerSubtitle2:
      "Phương Thảoと一緒にこの特別な日の喜びを分かち合いましょう！",

    // Invitation Section
    invitationGreeting: "親愛なる",
    invitationParagraph1:
      "長年の学びと努力の末、ついに卒業の日を迎えました。これは人生の中で最も重要な節目です。{toHost}は{toGuest}とこの喜びを分かち合いたいと願っています。",
    invitationParagraph2: "{toGuest}を{toHost}の卒業式にお招き申し上げます。",
    invitationTime: "日時:",
    invitationLocation: "場所:",
    invitationVenue: "ホーチミン市 情報通信大学",

    // RSVP
    rsvpAccept: "出席",
    rsvpDecline: "欠席",
    rsvpAcceptedTitle: "完了しました！",
    rsvpDeclinedTitle: "受け付けました！",
    rsvpAcceptedMessage: "卒業式への出席を受け付けました。",
    rsvpDeclinedMessage: "卒業式への欠席を受け付けました。",
    rsvpClose: "閉じる",
    rsvpChangeMindNote:
      "もしご都合が変わりましたら、「出席」を押して再度ご返信いただけます。",

    // Countdown
    countdownDays: "日間",
    countdownHours: "時間",
    countdownMinutes: "分間",
    countdownSeconds: "秒間",

    // Thank You Section
    thankYouTitle: "ありがとうございます",
    thankYouParagraph1:
      "{toGuest}が{toHost}の卒業式にご出席いただき、本当にありがとうございました。",
    thankYouParagraph2: "{toGuest}との時間は本当に素晴らしい思い出です！",

    // Directions
    directionsTitle: "アクセス",
    directionsSubtitle: "重要なポイント",
    graduationVenue: "卒業式会場",
    parkingArea: "駐車場",
    lunchVenue: "昼食会場",

    // Map
    mapLoading: "地図を読み込み中...",
    mapDirections: "ルート案内",
    mapCurrentLocation: "現在位置",
    mapUpdated: "更新：",
    mapAltitude: "高度：",

    // Notifications
    notificationAccepted: "{name}が出席を確認しました",
    notificationDeclined: "{name}が欠席を確認しました",
    notificationLunchAccepted: "{name}が昼食参加を確認しました",
    notificationLunchDeclined: "{name}が昼食欠席を確認しました",
    notificationRecentActivity: "最近のアクティビティ",
    notificationNoActivity: "確認がありません",
  },
};

export type Language = "vi" | "ja";

export function getTranslation(language: Language) {
  return translations[language] || translations.vi;
}
