"use client"

import { useEffect, useState } from "react";
import { ClubsProvider } from "../context/ClubContext";
import { FilterBox } from "./FilterBox";
import ListView from "./ListView";
import MapView from "./MapView";
import { Club } from "../types/clubs";


export default function ClientWrapper({ clubs }: { clubs: Club[] }) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [mobileView, setMobileView] = useState(false); 
  const [showMap, setShowMap] = useState(true);
  

  useEffect(() => {
    // Function to check if screen is smaller than 640px
    const handleResize = () => {
      setMobileView(window.innerWidth < 640);
    };
  
    // Set initial value
    handleResize();
  
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
  
    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <ClubsProvider clubs={clubs}>
      <div className="relative h-dvh">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 ">
          <h1 className="text-4xl font-bold bg-blue-950 text-white p-4 rounded-lg shadow-md max-lg:hidden ">
            Sats Club Locations
          </h1>
        </div>

      {mobileView ? (
        // Mobile layout
        <div className="flex flex-col w-full h-full">
        {/* Toggle Button for mobile */}
        <button 
  onClick={() => setShowMap(!showMap)}
  className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-blue-950 text-white p-2 px-6 rounded-lg shadow-lg"
>
  {showMap ? "List" : "Map"}
</button>

        {/* Conditional render based on showMap state */}
        <div className="h-full">
          {showMap ? <MapView /> : <ListView />}
        </div>
      </div>
      ) : (
        // Desktop layout
        <div className="flex w-full h-full">
          <div className="w-1/4 h-full">
            <div className="h-full bg-white border-r">
              <ListView />
            </div>
          </div>
          <div className="w-3/4 h-full">
            <MapView />
          </div>
        </div>
      )}

        <FilterBox 
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(!isFilterExpanded)}
        />
      </div>


      
    </ClubsProvider>
  );
}