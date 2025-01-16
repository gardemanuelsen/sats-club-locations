"use client";
import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Club } from "../types/clubs";

interface MapViewProps {
  clubs: Club[];
  selectedClub: Club | null;
  selectedCountry: string;
  onClubSelect: (club: Club | null) => void;
}

export default function MapView({
  clubs,
  selectedClub,
  selectedCountry,
  onClubSelect,
}: MapViewProps) {
  const [mapPosition, setmapPosition] = useState({
    longitude: 15.0,
    latitude: 57.0,
    zoom: 4,
  });

  useEffect(() => {
    // Close popup when country changes or if selectedClub is no longer in the clubs array
    if (
      selectedClub && !clubs.some((club) => club.id === selectedClub.id)
    ) {
      onClubSelect(null);
    }
  }, [clubs, selectedClub, onClubSelect]);
  
  // Add separate useEffect for country changes
  useEffect(() => {
    onClubSelect(null);
  }, [selectedCountry]);

  //Move map to selectedClub location
  useEffect(() => {
    if (selectedClub?.geoLocation) {
      setmapPosition((prev) => ({
        ...prev,
        longitude: selectedClub.geoLocation!.longitude,
        latitude: selectedClub.geoLocation!.latitude,
      }));
    }
  }, [selectedClub]);

  //Move map to selectedCountry position

  useEffect(() => {
    console.log(clubs)
    if (selectedCountry === "all") {
      setmapPosition({
        longitude: 15.0,
        latitude: 57.0,
        zoom: 4,
      });
    } else if (clubs.length > 0) {
      // First try to find a club in the capital city
      const capitalClubs = clubs.filter((club) => {
        const cityLower = club.address.city.toLowerCase();
        return (
          (selectedCountry === "Norway" && cityLower.includes("oslo")) ||
          (selectedCountry === "Denmark" && cityLower.includes("københavn")) ||
          (selectedCountry === "Sweden" && cityLower.includes("stockholm")) ||
          (selectedCountry === "Finland" && cityLower.includes("helsinki"))
        );
      });
      console.log("Capital clubs found:", capitalClubs); 

      if (capitalClubs.length > 0) {
        // If we found clubs in the capital, use the first one
        const capitalClub = capitalClubs[0];
        setmapPosition({
          longitude: capitalClub.geoLocation!.longitude,
          latitude: capitalClub.geoLocation!.latitude,
          zoom: 10,
        });
      } else {
        // If no capital clubs found, use any club from the filtered array
        const areaClub = clubs[0];
        setmapPosition({
          longitude: areaClub.geoLocation!.longitude,
          latitude: areaClub.geoLocation!.latitude,
          zoom: 10,
        });
      }
    }
  }, [selectedCountry, clubs]);

  const formatTime = (hour: number, minute: number) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const getClubOpeningHours = (openingHours: any) => {
    // Find the opening hours for "Club"
    const clubHours = openingHours.regularOpeningHours.find(
      (hours: any) => hours.hoursFor === "Club"
    );
    return clubHours ? clubHours.days : [];
  };

  return (
    <Map
      {...mapPosition}
      onMove={(evt) => setmapPosition(evt.viewState)}
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
                      {daySchedule.timeSpans.map(
                        (timeSpan: any, index: number) => (
                          <span key={index}>
                            {formatTime(
                              timeSpan.opens.hour,
                              timeSpan.opens.minute
                            )}{" "}
                            -
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
      )}
    </Map>
  );
}
