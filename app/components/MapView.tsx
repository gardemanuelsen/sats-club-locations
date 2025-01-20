"use client";
import { useState, useEffect } from "react";
import Map, {
  GeolocateControl,
  FullscreenControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ClosestClub, Location } from "../types/clubs";
import { useClubs } from "../context/ClubContext";
import CustomMarker from "../ui/CustomMarker";
import CustomPopup from "../ui/CustomPopup";
import ShowClosestClub from "../ui/ShowClosestClub";



export default function MapView() {
  const {
    filteredClubs: clubs,
    selectedClub,
    selectedCountry,
    setSelectedClub: onClubSelect,
  } = useClubs();

  const [mapPosition, setmapPosition] = useState({
    longitude: 15.0,
    latitude: 57.0,
    zoom: 4,
  });

  const [userLocation, setUserLocation] = useState<Location | null>(null);
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

  const findClosestClub = (position: GeolocationCoordinates) => {
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
        ),
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    setClosestClub(clubWithDistance);
  };

  return (
    <Map
      {...mapPosition}
      onMove={(evt) => setmapPosition(evt.viewState)}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {/* Draw route to closest club */}
      <ShowClosestClub userLocation={userLocation} closestClub={closestClub} />
      {/* Custom marker from react-map-gl*/}
      <CustomMarker userLocation={userLocation} />
      {/* Custom popup from react-map-gl*/}
      <CustomPopup />

      <GeolocateControl
        position="top-right"
        onGeolocate={(e) => findClosestClub(e.coords)}
        showUserLocation={false}
      />
      <FullscreenControl position="top-right" />
      <NavigationControl position="top-right" />
      <ScaleControl />
    </Map>
  );
}
