export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">

      {/* SPINNING FOOD ICON */}
      <div className="relative">
        <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
          🍽️
        </div>
      </div>

    </div>
  );
}