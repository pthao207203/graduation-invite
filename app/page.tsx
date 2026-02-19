export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#01443D] mb-4">
            Lời Mời Tốt Nghiệp
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chào mừng đến hệ thống lời mời lễ tốt nghiệp
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              📝 Cách Truy Cập Lời Mời
            </h2>
            <p className="text-blue-800 mb-2">
              Nếu bạn nhận được mã lời mời, hãy truy cập:
            </p>
            <code className="bg-white px-3 py-2 rounded text-sm block text-blue-700">
              /invite/[your-code]
            </code>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-left">
            <h2 className="text-lg font-semibold text-purple-900 mb-3">
              🔧 Truy Cập Quản Trị
            </h2>
            <p className="text-purple-800 mb-2">Quản lý khách và cài đặt:</p>
            <a
              href="/admin"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Đi Tới Bảng Điều Khiển
            </a>
          </div>
        </div>

        <div className="mt-8 text-gray-600 text-sm">
          <p>
            Được xây dựng với Next.js 14, TypeScript, Tailwind CSS và Firebase
          </p>
        </div>
      </div>
    </div>
  );
}
