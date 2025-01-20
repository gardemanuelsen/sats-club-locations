import { useEffect, useRef, useState } from "react";
import { Club } from "../types/clubs";
import { useClubs } from "../context/ClubContext";

interface GroupedClubs {
  [country: string]: {
    [area: string]: Club[];
  };
}

export default function ListView() {
    const { 
        filteredClubs: clubs, 
        selectedClub, 
        setSelectedClub: onClubSelect 
    } = useClubs();

   
    
    const containerRef = useRef<HTMLDivElement>(null);

    //Sorting by country and area
    const groupedClubs = clubs.reduce<GroupedClubs>((acc, club) => {
        const country = club.address.country;
        const area = club.salesCluster?.name || 'Other';
        
        //Puts club object based on for example: area[norway][rogaland]
        //Dosen´t exist an empty array is assigned
       
        if (!acc[country]) {
            acc[country] = {};
        }
        
        if (!acc[country][area]) {
            acc[country][area] = [];
        }
        
        
        acc[country][area].push(club);
        return acc;
    }, {});


    //Findig selectedElement and scrolling to it
    useEffect(() => {
        if (selectedClub && containerRef.current) {
            const selectedElement = document.getElementById(selectedClub.id);
            
            if (selectedElement && containerRef.current) {
                const container = containerRef.current;
                const containerHeight = container.clientHeight;
                const elementTop = selectedElement.offsetTop;
                const targetPosition = elementTop - (containerHeight * 0.2);

                container.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedClub]);

    return (
        <div ref={containerRef} className="h-full overflow-y-auto">
        {Object.entries(groupedClubs).map(([country, areas]) => (
            <div key={country}>
                <div className="sticky top-0 bg-blue-950 text-white text-2xl px-4 py-6 font-bold z-20">
                    {country}
                </div>
                
                {Object.entries(areas).map(([area, areaClubs]: [string, Club[]]) => (
                    <div key={`${country}-${area}`}>
                        <div className="sticky top-20 bg-blue-100 text-lg px-4 py-4 font-semibold">
                            {area}
                        </div>
                        
                        {areaClubs.map((club) => (
                            <div 
                                key={club.id}
                                id={club.id} 
                                onClick={() => onClubSelect(club)}
                                className={`p-4 border-b hover:bg-gray-50 cursor-pointer
                                    ${selectedClub?.id === club.id 
                                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                                        : 'border-l-4 border-l-transparent'
                                    }
                                `}
                            >
                                <div className="space-y-2">
                                    {/* Club name */}
                                    <h3 className="font-bold lg:text-lg sm:text-sm md:text-md text-gray-900">
                                        {club.name}
                                    </h3>
    
                                    {/* Address */}
                                    <p className="text-sm text-gray-600 font-semibold">
                                        Address: {club.address.address1}
                                    </p>
    
                                    {/* Club Features */}
                                    {club.clubFeatures && club.clubFeatures.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {club.clubFeatures.map((feature) => (
                                                <span 
                                                    key={feature.id} 
                                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                                                >
                                                    {feature.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
    
                                    {/* Max Capacity */}
                                    {club.maxGymFloorCapacity && (
                                        <p className="text-sm text-gray-600">
                                            Max Capacity: <span className="font-medium">{club.maxGymFloorCapacity}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        ))}
    </div>
    );
}