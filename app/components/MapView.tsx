"use client";
import { useState, useEffect } from "react";
import Map, {
  Marker,
  Popup,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Club } from "../types/clubs";
import { useClubs } from "../context/ClubContext";

interface ClosestClub {
  club: Club;
  distance: number;
}

export default function MapView() {
  const { 
    filteredClubs: clubs,
    selectedClub,
    selectedCountry,
    setSelectedClub: onClubSelect 
  } = useClubs();

  const [mapPosition, setmapPosition] = useState({
    longitude: 15.0,
    latitude: 57.0,
    zoom: 4,
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [closestClub, setClosestClub] = useState<ClosestClub | null>(null);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    if (selectedClub && !clubs.some((club) => club.id === selectedClub.id)) {
      onClubSelect(null);
    }
  }, [clubs, selectedClub, onClubSelect]);

  useEffect(() => {
    onClubSelect(null);
    setClosestClub(null);
    setUserLocation(null);
  }, [selectedCountry, onClubSelect]);

  useEffect(() => {
    if (selectedClub?.geoLocation) {
      setmapPosition((prev) => ({
        ...prev,
        longitude: selectedClub.geoLocation!.longitude,
        latitude: selectedClub.geoLocation!.latitude,
      }));
    }
  }, [selectedClub]);

  useEffect(() => {
    if (selectedCountry === "all") {
      setmapPosition({
        longitude: 15.0,
        latitude: 57.0,
        zoom: 4,
      });
    } else if (clubs.length > 0) {
      const capitalClubs = clubs.filter((club) => {
        const cityLower = club.address.city.toLowerCase();
        return (
          (selectedCountry === "Norway" && cityLower.includes("oslo")) ||
          (selectedCountry === "Denmark" && cityLower.includes("københavn")) ||
          (selectedCountry === "Sweden" && cityLower.includes("stockholm")) ||
          (selectedCountry === "Finland" && cityLower.includes("helsinki"))
        );
      });

      if (capitalClubs.length > 0) {
        const capitalClub = capitalClubs[0];
        setmapPosition({
          longitude: capitalClub.geoLocation!.longitude,
          latitude: capitalClub.geoLocation!.latitude,
          zoom: 10,
        });
      } else {
        const areaClub = clubs[0];
        setmapPosition({
          longitude: areaClub.geoLocation!.longitude,
          latitude: areaClub.geoLocation!.latitude,
          zoom: 10,
        });
      }
    }
  }, [selectedCountry, clubs]);

  const findClosestClub = (position: any) => {
    const myLatitude = position.latitude;
    const myLongitude = position.longitude;
    setUserLocation({ latitude: myLatitude, longitude: myLongitude });

    const clubWithDistance = clubs
      .filter((club) => club.geoLocation)
      .map((club) => ({
        club,
        distance: calculateDistance(
          myLatitude,
          myLongitude,
          club.geoLocation!.latitude,
          club.geoLocation!.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    setClosestClub(clubWithDistance);
  };

  const formatTime = (hour: number, minute: number) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const getClubOpeningHours = (openingHours: any) => {
    const clubHours = openingHours.regularOpeningHours.find(
      (hours: any) => hours.hoursFor === "Club"
    );
    return clubHours ? clubHours.days : [];
  };

  const createRouteFeature = (club: Club) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [userLocation!.longitude, userLocation!.latitude],
        [club.geoLocation!.longitude, club.geoLocation!.latitude],
      ],
    },
  });

  return (
    <Map
      {...mapPosition}
      onMove={(evt) => setmapPosition(evt.viewState)}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {/* Draw route to closest club */}
      {userLocation && closestClub && (
        <Source
          key={closestClub.club.id}
          id={`route-${closestClub.club.id}`}
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [createRouteFeature(closestClub.club)],
          }}
        >
          <Layer
            id={`route-layer-${closestClub.club.id}`}
            type="line"
            paint={{
              "line-color": "#172554",
              "line-width": 5,
              "line-dasharray": [2, 1],
            }}
          />

          <Layer
            id={`route-label-${closestClub.club.id}`}
            type="symbol"
            layout={{
              "text-field": `${closestClub.distance.toFixed(1)} km`,
              "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
              "text-size": 16,
              "text-offset": [0, -0.5],
              "text-anchor": "center",
              "symbol-placement": "line-center",
            }}
            paint={{
              "text-color": "#000",
              "text-halo-color": "#fff",
              "text-halo-width": 2,
            }}
          />
        </Source>
      )}

      {/* User location marker */}
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
          anchor="center"
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
        </Marker>
      )}

      {/* Club markers */}
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
            className="transition-all duration-300 ease-in-out"
          >
            <span className="text-2xl text-white">📍</span>
          </button>
        </Marker>
      ))}

      {/* Selected club popup */}
      {selectedClub && selectedClub.geoLocation && (
        <Popup
          longitude={selectedClub.geoLocation.longitude}
          latitude={selectedClub.geoLocation.latitude}
          onClose={() => onClubSelect(null)}
          closeOnClick={false}
        >
          <div className="p-4">
            <h3 className="font-bold text-xl">{selectedClub.name}</h3>
            {closestClub?.club.id === selectedClub.id && (
              <p className="text-md text-gray-600 mt-1">
                Distance: {closestClub.distance.toFixed(1)} km
              </p>
            )}
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

      <GeolocateControl
        onGeolocate={(e) => findClosestClub(e.coords)}
        showUserLocation={false}
      />
    </Map>
  );
}