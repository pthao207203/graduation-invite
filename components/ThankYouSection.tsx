import Image from "next/image";

export default function ThankYouSection() {
  return (
    <section
      className="w-full py-8 md:py-20 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/section4.png')" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Photo with Brush Border */}
        <div className="relative inline-block mb-8">
          {/* Brush stroke SVG border */}
          <svg
            className="absolute inset-0 w-full h-full -m-4"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="#01443D"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="3 8"
              opacity="0.7"
            />
          </svg>

          {/* Image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
            <Image
              src="/Ảnh 2.png"
              alt="Phương Thảo"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Thank You Text */}
        <h2 className="font-display text-4xl md:text-7xl text-[#01443D] mb-6">
          Xin cảm ơn
        </h2>

        <p className="font-body text-lg text-[#01443D] max-w-xl mx-auto">
          Cảm ơn bạn đã dành thời gian tham dự và chia sẻ niềm vui trong ngày
          đặc biệt này!
        </p>
      </div>
    </section>
  );
}
