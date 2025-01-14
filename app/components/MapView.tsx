"use client";

import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Club {
  id: string;
  name: string;
  clubType?: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    regularOpeningHours: Array<{
      days: Array<{
        day: string;
        timeSpans: Array<{
          opens: { hour: number; minute: number };
          closes: { hour: number; minute: number };
        }>;
      }>;
    }>;
  };
}

interface ClubsResponse {
  clubs: Club[];
}


export default function MapView() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getClubs = async () => {
      try {
        const response = await fetch("/api/clubs");
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data: ClubsResponse = await response.json();

        // Filter clubs to include only physical locations
        const validClubs = data.clubs.filter(
          (club: Club) =>
            // Ensure geolocation exists
            club.geoLocation &&
            club.geoLocation.latitude != null &&
            club.geoLocation.longitude != null &&
            // Exclude web centers or online services
            club.clubType !== "WebCenter" &&
            club.clubType !== "OnlineService"
        );

        setClubs(validClubs);
        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch clubs"
        );
        setLoading(false);
      }
    };
    getClubs();
  }, []);

  const formatTime = (hour: number, minute: number) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  if (loading) return <div>Loading clubs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full w-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 10.7522,
          latitude: 59.9139,
          zoom: 8,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {clubs.map((club) => (
          <Marker
            key={club.id}
            longitude={club.geoLocation!.longitude}
            latitude={club.geoLocation!.latitude}
            anchor="bottom"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedClub(club);
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
            anchor="bottom"
            onClose={() => setSelectedClub(null)}
            closeOnClick={false}
          >
            <div className="p-4">
              <h3 className="font-bold text-xl">{selectedClub.name}</h3>
              <h1 className="text-md font-semibold mt-2">Opening Hours</h1>
              {selectedClub.openingHours.regularOpeningHours[0].days.map(
                (daySchedule) => (
                  <div
                    key={daySchedule.day}
                    className="flex justify-between gap-4"
                  >
                    <span>{daySchedule.day}:</span>
                    {daySchedule.timeSpans.length > 0 ? (
                      <span>
                        {formatTime(
                          daySchedule.timeSpans[0].opens.hour,
                          daySchedule.timeSpans[0].opens.minute
                        )}{" "}
                        -
                        {formatTime(
                          daySchedule.timeSpans[0].closes.hour,
                          daySchedule.timeSpans[0].closes.minute
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
    </div>
  );
}
