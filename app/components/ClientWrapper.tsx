"use client";

import { useEffect, useState } from "react";
import { ClubsProvider } from "../context/ClubContext";
import { FilterBox } from "../ui/FilterBox";
import ListView from "./ListView";
import MapView from "./MapView";
import { Club } from "../types/clubs";

export default function ClientWrapper({ clubs }: { clubs: Club[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [showMap, setShowMap] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 640);
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ClubsProvider clubs={clubs}>
      <div className="relative h-dvh">
       

        {mobileView ? (
          // Mobile
          <div className="flex flex-col w-full h-full">
            <div className="h-full">
              {showMap ? <MapView /> : <ListView />}
            </div>
          </div>
        ) : (
          // Desktop
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
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          mobileView={mobileView}
          showMap={showMap}
          setShowMap={setShowMap}
        />
      </div>
    </ClubsProvider>
  );
}