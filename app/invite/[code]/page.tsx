import { notFound } from "next/navigation";
import { getGuestByCode, getEventConfig } from "@/lib/firestore";
import HeroSection from "@/components/HeroSection";
import InvitationSection from "@/components/InvitationSection";
import DirectionsSection from "@/components/DirectionsSection";
import ThankYouSection from "@/components/ThankYouSection";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { code } = await params;

  // Fetch guest and event config
  const [guest, eventConfig] = await Promise.all([
    getGuestByCode(code),
    getEventConfig(),
  ]);

  // If guest not found, show 404
  if (!guest) {
    notFound();
  }

  // If event config not found, show error
  if (!eventConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Lỗi Cấu Hình</h1>
          <p className="text-[#01443D]">
            Không tìm thấy cấu hình sự kiện. Vui lòng liên hệ với quản trị viên.
          </p>
        </div>
      </div>
    );
  }

  // Convert timestamp to Date (handle 0 or invalid timestamps)
  const eventDate =
    eventConfig.eventDate > 0 ? new Date(eventConfig.eventDate) : new Date();
  console.log("Role data:", guest);
  return (
    <>
      {/* Fixed Header */}
      <header className="relative md:fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 md:py-3">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6">
            {/* Left: Title */}
            <div className="shrink-0">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#01443D] whitespace-nowrap">
                Chúc mừng tốt nghiệp!
              </h1>
            </div>

            {/* Right: Note */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-body text-sm md:text-base text-[#01443D] leading-relaxed pt-1 md:pt-2.5">
                Hành trình học vấn đã kết thúc, một chặng đường mới đang bắt
                đầu.
                <br />
                Hãy cùng chia sẻ niềm vui trong ngày đặc biệt này với Phương
                Thảo nhé!
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 4 Sections */}
      <main className="md:pt-[5rem]">
        {/* Section 1: Hero with Background Image */}
        <HeroSection eventDate={eventDate} />

        {/* Section 2: Invitation + Calendar */}
        <InvitationSection
          guestName={guest.name}
          uniqueCode={guest.uniqueCode}
          eventStatus={guest.rsvpStatus}
          eventDate={eventConfig.eventDate}
          roleId={guest.roleId}
        />

        {/* Lunch RSVP (if invited) */}
        {/* {guest.inviteLunch && (
          <div className="bg-linear-to-br from-orange-50 via-yellow-50 to-amber-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-none border-4 border-orange-600 shadow-lg p-8 text-center">
                <h3 className="font-display text-4xl text-[#01443D] mb-4">
                  Lời mời ăn trưa
                </h3>
                <p className="font-body text-[#01443D] mb-6">
                  Hãy tham gia bữa trưa kỷ niệm sau lễ tốt nghiệp
                </p>
                <RSVPButtons
                  uniqueCode={guest.uniqueCode}
                  type="lunch"
                  currentStatus={guest.lunchStatus}
                />
              </div>
            </div>
          </div>
        )} */}

        {/* Section 3: Directions with Map */}
        <DirectionsSection
          eventConfig={eventConfig}
          showParking={guest.needParkingMap}
          showLunch={guest.inviteLunch}
        />

        {/* Section 4: Thank You */}
        <ThankYouSection roleId={guest.roleId} />
      </main>
    </>
  );
}
