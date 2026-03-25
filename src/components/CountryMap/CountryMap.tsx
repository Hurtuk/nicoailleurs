// TripMap.tsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import type { City } from "../../api/models/City";
import styles from './CountryMap.module.scss';

// Fix l'icône par défaut de Leaflet qui casse avec les bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface TripMapProps {
  cities: City[];
  height?: number;
  itinerary?: boolean;
  itineraryColor?: string;
}

export default function TripMap({
  cities,
  height = 350,
  itinerary = false,
  itineraryColor = "#e53e3e",
}: TripMapProps) {
  function SingleCityView({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 6); // 6 = vue pays, ajuste selon ton goût
    }, [lat, lng, map]);
    return null;
  }

  const positions = useMemo(
    () => cities.map((c) => ({
      ...c,
      lat: parseFloat(c.latitude),
      lng: parseFloat(c.longitude),
    })),
    [cities]
  );

  // Calcul du bounds pour le zoom automatique
  const bounds = useMemo(() => {
    if (positions.length === 0) return undefined;
    return L.latLngBounds(positions.map((p) => [p.lat, p.lng]));
  }, [positions]);

  const polylinePoints = useMemo(
    () => positions.map((p) => [p.lat, p.lng] as [number, number]),
    [positions]
  );

  if (positions.length === 0) return null;

  const isSingleCity = positions.length === 1;

  return (
    <MapContainer
      {...(isSingleCity
        ? { center: [positions[0].lat, positions[0].lng], zoom: 5 }
        : { bounds, boundsOptions: { padding: [100, 100] } }
      )}
      style={{ height }}
      className={styles.mapWrapper}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Forcer le zoom via le hook useMap (plus fiable que les props) */}
      {isSingleCity && (
        <SingleCityView lat={positions[0].lat} lng={positions[0].lng} />
      )}

      {positions.map((city) => (
        <Marker key={city.id} position={[city.lat, city.lng]}>
          <Popup>{city.name}</Popup>
        </Marker>
      ))}

      {itinerary && polylinePoints.length > 1 && (
        <Polyline
          positions={polylinePoints}
          pathOptions={{
            color: itineraryColor,
            weight: 2,
            dashArray: "6, 4",
          }}
        />
      )}
    </MapContainer>
  );
}