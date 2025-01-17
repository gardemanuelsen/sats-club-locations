// components/LoadingMap.tsx
export default function LoadingPage() {
  return (
    <div className="h-dvh flex items-center justify-center bg-blue-950">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl md:text-4xl lg:text-6xl text-white font-bold">
          Sats Club Locations
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 lg:h-24 lg:w-24 border-b-2"></div>
        <p className="text-white text-md lg:text-lg">Loading clubs...</p>
      </div>
    </div>
  );
}
