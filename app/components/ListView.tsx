import { useEffect, useRef } from "react";
import { Club } from "../types/clubs";

interface ListViewProps {
  clubs: Club[];
  selectedClub: Club | null;
  onClubSelect: (club: Club | null) => void;
}

// Define the structure of our grouped clubs object
interface GroupedClubs {
  [country: string]: {
    [area: string]: Club[];
  };
}

export default function ListView({clubs, selectedClub, onClubSelect}: ListViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Add type to the initial value and use the GroupedClubs interface
    const groupedClubs = clubs.reduce<GroupedClubs>((acc, club) => {
        const country = club.address.country;
        const area = club.salesCluster?.name || 'Other';
        
        if (!acc[country]) {
            acc[country] = {};
        }
        
        if (!acc[country][area]) {
            acc[country][area] = [];
        }
        
        acc[country][area].push(club);
        return acc;
    }, {});

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
                                    <h3 className="font-bold text-2xl">{club.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {club.address.address1}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}