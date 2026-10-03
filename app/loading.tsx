export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-red-700 font-semibold tracking-wider animate-pulse">Processing...</p>
      </div>
    </div>
  );
}
