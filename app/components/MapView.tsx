'use client'
import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Club } from "../types/clubs";

interface MapViewProps {
  clubs: Club[];
  selectedClub: Club | null;
  onClubSelect: (club: Club | null) => void;
}

export default function MapView({ clubs, selectedClub, onClubSelect }: MapViewProps) {
  const [mapPosition, setmapPosition] = useState({
    longitude: 10.7522,
    latitude: 59.9139,
    zoom: 10
  });

  useEffect(() => {
    // Close popup if clubs array changes or selectedClub is no longer in the clubs array
    if (clubs.length === 0 || (selectedClub && !clubs.some(club => club.id === selectedClub.id))) {
      onClubSelect(null);
    }
  }, [clubs, selectedClub, onClubSelect]);

  useEffect(() => {
    if (selectedClub?.geoLocation) {
      setmapPosition(prev => ({
        ...prev,
        longitude: selectedClub.geoLocation!.longitude,
        latitude: selectedClub.geoLocation!.latitude,
      }));
    }
  }, [selectedClub]);

  const formatTime = (hour: number, minute: number) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const getClubOpeningHours = (openingHours: any) => {
    // Find the opening hours for "Club"
    const clubHours = openingHours.regularOpeningHours.find((hours: any) => hours.hoursFor === "Club");
    return clubHours ? clubHours.days : [];
  };

  return (
    <Map
      {...mapPosition}
      onMove={evt => setmapPosition(evt.viewState)}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {clubs.map((club) => (
        <Marker
          key={club.id}
          longitude={club.geoLocation!.longitude}
          latitude={club.geoLocation!.latitude}
          anchor="top"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onClubSelect(club);
            }}
          >
            <span className="text-white text-2xl">📍</span>
          </button>
        </Marker>
      ))}

      {selectedClub && selectedClub.geoLocation && (
        <Popup
          longitude={selectedClub.geoLocation.longitude}
          latitude={selectedClub.geoLocation.latitude}
          onClose={() => onClubSelect(null)}
          closeOnClick={false}
        >
          <div className="p-4">
            <h3 className="font-bold text-xl">{selectedClub.name}</h3>
            <h1 className="text-md font-semibold mt-2">Opening Hours</h1>
            {getClubOpeningHours(selectedClub.openingHours).map(
              (daySchedule: any) => (
                <div
                  key={daySchedule.day}
                  className="flex justify-between gap-4"
                >
                  <span>{daySchedule.day}:</span>
                  {daySchedule.timeSpans?.length > 0 ? (
                    <span>
                      {daySchedule.timeSpans.map((timeSpan: any, index: number) => (
                        <span key={index}>
                          {formatTime(timeSpan.opens.hour, timeSpan.opens.minute)} - 
                          {formatTime(timeSpan.closes.hour, timeSpan.closes.minute)}
                          {index < daySchedule.timeSpans.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span>Closed</span>
                  )}
                </div>
              )
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}