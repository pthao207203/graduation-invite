export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-[#01443D] mb-4">
          Invitation Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The invitation code you're looking for doesn't exist or may have been
          removed.
        </p>
        <p className="text-sm text-gray-500">
          Please check your invitation code and try again.
        </p>
      </div>
    </div>
  );
}
