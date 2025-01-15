// components/LoadingMap.tsx
export default function LoadingPage() {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading clubs...</p>
        </div>
      </div>
    );
  }