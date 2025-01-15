import { useEffect, useRef } from "react";
import { Club } from "../types/clubs";

interface ListViewProps {
  clubs: Club[];
  selectedClub: Club | null;
  onClubSelect: (club: Club | null)=>void
}

export default function ListView({clubs, selectedClub, onClubSelect} : ListViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

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
        <div 
            ref={containerRef}
            className="h-full overflow-y-auto"
        >
            {clubs.map((club) => (
                <div 
                    key={club.id}
                    id={club.id} 
                    onClick={() => {
                    
                        onClubSelect(club);
                    }}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors
                        ${selectedClub?.id === club.id 
                            ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                            : 'border-l-4 border-l-transparent'
                        }
                    `}
                >
                    <h3 className="font-bold">{club.name}</h3>
                    <p className="text-sm text-gray-600">
                        {club.geoLocation?.street}
                    </p>
                    <p className="text-sm text-gray-600">
                        {club.address.address1}
                    </p>
                </div>
            ))}
        </div>
    );
}