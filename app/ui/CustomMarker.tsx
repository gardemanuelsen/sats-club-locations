import { Marker } from "react-map-gl";
import { useClubs } from "../context/ClubContext";

const CustomMarker = ({ userLocation }: any) => {
  const { filteredClubs: clubs, setSelectedClub: onClubSelect } = useClubs();

  return (
    <>
      {/* Current location marker */}
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
    </>
  );
};

export default CustomMarker;
