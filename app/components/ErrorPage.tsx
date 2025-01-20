interface ErrorPageProps {
    error: Error | unknown;
  }
  
  export default function ErrorPage({error}: ErrorPageProps) {

    const statusCode = error && typeof error === 'object' && 'response' in error 
      ? (error.response as any).code 
      : 500;  // Fallback status code
  
    return (
      <div className="h-dvh flex items-center justify-center bg-blue-950">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl text-white font-bold">
            Sats Club Locations
          </h1>
          <h2 className="text-white">{statusCode}</h2>
          <p className="text-white text-md lg:text-lg">
            Failed to load clubs data. Please try refreshing.
          </p>
        </div>
      </div>
    );
  }