import { Popup } from "react-map-gl";
import { useClubs } from "../context/ClubContext";

const CustomPopup = ({ closestClub }: any) => {
  const { selectedClub, setSelectedClub: onClubSelect } = useClubs();

  const formatTime = (hour: number, minute: number) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const getClubOpeningHours = (openingHours: any) => {
    const clubHours = openingHours.regularOpeningHours.find(
      (hours: any) => hours.hoursFor === "Club"
    );
    return clubHours ? clubHours.days : [];
  };

  return (
    <>
      {selectedClub && selectedClub.geoLocation && (
        <>
          <style>
            {`
                    .mapboxgl-popup-content {
                      padding: 20px ;
                      min-width: 300px;
                    }
                    .mapboxgl-popup-close-button {
                      padding: 8px 12px ;
                      font-size: 30px ;
                      color: #666 ;
                      right: 4px ;
                      top: 4px ;
                    }
                    .mapboxgl-popup-close-button:hover {
                      background-color: transparent ;
                      color: #000 ;
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
              {closestClub?.club.id === selectedClub.id && (
                <p className="text-md text-gray-600 mt-1">
                  Distance: {closestClub.distance.toFixed(1)} km
                </p>
              )}
              <h1 className="text-md font-semibold mt-4">Opening Hours</h1>
              {getClubOpeningHours(selectedClub.openingHours).map(
                (daySchedule: any) => (
                  <div
                    key={daySchedule.day}
                    className="flex justify-between gap-4 mt-1"
                  >
                    <span>{daySchedule.day}:</span>
                    {daySchedule.timeSpans?.length > 0 ? (
                      <span>
                        {daySchedule.timeSpans.map(
                          (timeSpan: any, index: number) => (
                            <span key={index}>
                              {formatTime(
                                timeSpan.opens.hour,
                                timeSpan.opens.minute
                              )}{" "}
                              -{" "}
                              {formatTime(
                                timeSpan.closes.hour,
                                timeSpan.closes.minute
                              )}
                              {index < daySchedule.timeSpans.length - 1 && ", "}
                            </span>
                          )
                        )}
                      </span>
                    ) : (
                      <span>Closed</span>
                    )}
                  </div>
                )
              )}
            </div>
          </Popup>
        </>
      )}
    </>
  );
};

export default CustomPopup;
