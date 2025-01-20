import { Popup } from "react-map-gl";
import { useClubs } from "../context/ClubContext";
import { OpeningHours, RegularOpeningHours, Days, TimeSpan } from "../types/clubs";
import { useState } from "react";




const CustomPopup = () => {
  const { selectedClub, setSelectedClub: onClubSelect } = useClubs();
  const [showingHoursType, setShowingHoursType] = useState<"Club" | "Staffed">("Club");

  const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const getOpeningHours = (openingHours: OpeningHours, type: "Club" | "Staffed"): Days[] => {
    const hours = openingHours.regularOpeningHours.find(
      (hour: RegularOpeningHours) => hour.hoursFor === type
    ) as RegularOpeningHours | undefined;
    
    return hours ? hours.days : [];
  }
    const hasStaffedHours = (openingHours: OpeningHours): boolean => {
      const staffedHours = getOpeningHours(openingHours, "Staffed");
      return staffedHours.some(day => day.timeSpans.length > 0);
    };

  const renderSchedule = (days: Days[], title: string) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-md font-semibold">{title}</h1>
        {selectedClub && hasStaffedHours(selectedClub.openingHours) && (
          <button
            onClick={() => setShowingHoursType(showingHoursType === "Club" ? "Staffed" : "Club")}
            className="px-3 py-1 text-sm bg-blue-200 border-2 border-blue-950 hover:bg-blue-100 rounded transition-colors"
          >
            Show {showingHoursType === "Club" ? "Staffed" : "Club"} Hours
          </button>
        )}
      </div>
      {days.map((daySchedule) => (
        <div
          key={daySchedule.day}
          className="flex justify-between gap-4 mt-1"
        >
          <span>{daySchedule.day}:</span>
          {daySchedule.timeSpans?.length > 0 ? (
            <span>
              {daySchedule.timeSpans.map((timeSpan: TimeSpan, index: number) => (
                <span key={index}>
                  {formatTime(timeSpan.opens.hour, timeSpan.opens.minute)} -{" "}
                  {formatTime(timeSpan.closes.hour, timeSpan.closes.minute)}
                  {index < daySchedule.timeSpans.length - 1 && ", "}
                </span>
              ))}
            </span>
          ) : (
            <span>Closed</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {selectedClub && selectedClub.geoLocation && (
        <>
          <style>
            {`
              .mapboxgl-popup-content {
                padding: 20px;
                min-width: 300px;
              }
              .mapboxgl-popup-close-button {
                padding: 8px 12px;
                font-size: 30px;
                color: #666;
                right: 4px;
                top: 4px;
              }
              .mapboxgl-popup-close-button:hover {
                background-color: transparent;
                color: #000;
              }
            `}
          </style>
          <Popup
            longitude={selectedClub.geoLocation.longitude}
            latitude={selectedClub.geoLocation.latitude}
            onClose={() => onClubSelect(null)}
            closeOnClick={false}
          >
            <div>
              <h3 className="font-bold text-xl mb-2">{selectedClub.name}</h3>
           
              
              {renderSchedule(
                getOpeningHours(selectedClub.openingHours, showingHoursType),
                `${showingHoursType} Hours`
              )}
            </div>
          </Popup>
        </>
      )}
    </>
  );
};

export default CustomPopup;