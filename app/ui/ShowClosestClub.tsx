import { Layer, Source } from "react-map-gl";
import { ClosestClub, Club, Location,   } from "../types/clubs";

interface Props {
  closestClub: ClosestClub | null;
  userLocation: Location | null;
}

const ShowClosestClub = ({ userLocation, closestClub }: Props) => {
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
    <>
      {userLocation && closestClub && (
        <Source
          key={`source-${closestClub.club.id}`}
          id={`source-${closestClub.club.id}`}
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [createRouteFeature(closestClub.club)],
          }}
        >
          <Layer
            id={`line-${closestClub.club.id}`}
            type="line"
            paint={{
              "line-color": "#172554",
              "line-width": 5,
              "line-dasharray": [2, 1],
            }}
          />

          <Layer
              id={`label-${closestClub.club.id}`}
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
    </>
  );
};

export default ShowClosestClub;
