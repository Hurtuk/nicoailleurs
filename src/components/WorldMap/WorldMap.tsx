import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import styles from "./WorldMap.module.scss";

const GEO_URL = 'https://unpkg.com/world-atlas@2/countries-110m.json';

export type PlaceConfig = {
  url: string;
  label: string;
  coordinates?: [number, number];
};

type Props = {
  countryConfig: Record<string, PlaceConfig>;
  markers?: PlaceConfig[]
};
  
const dimensions = { width: 800, height: 400 };

export default function WorldMap({ countryConfig, markers }: Props) {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);

  const handleCountryClick = useCallback((geo: any) => {
    const config = countryConfig[geo.id];
    if (config) navigate(config.url);
  }, [countryConfig, navigate]);

  const handleCityClick = useCallback((marker: PlaceConfig) => {
    navigate(marker.url);
  }, [navigate]);

  const rotations = useMemo(
    () => markers?.map(m => [m.url, Math.random() * -28] as [string, number]) ?? [],
    [markers]
  );

  return (
    <div className={styles.wrapper}>
      <ComposableMap
        width={dimensions.width}
        height={dimensions.height}
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: 150,
          center: [0, 0],
          rotate: [-10, 0, 0]
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => 
            geographies
              .filter(geo => String(geo.id) !== "010")
              .map((geo) => {
                const key: string = geo.id;
                const config = countryConfig[key];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={config ? "rgba(110, 135, 111, .9)" : "rgba(255, 255, 255, .3)"}
                    stroke="rgb(0,0,0,.5)"
                    strokeOpacity={.4}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover:   { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    className={config ? styles.countryClickable : styles.country}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={(e) => {
                      if (config) setTooltip({ label: config.label, x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                    }}
                    onMouseLeave={() => {
                      setTooltip(null);
                    }}
                  />
                );
              }
            )
          }
        </Geographies>
        {markers?.map(marker => (
          <Marker
            key={marker.url}
            coordinates={marker.coordinates}
            onClick={() => handleCityClick(marker)}
            className={styles.marker}
            onMouseEnter={(e) => {
              setTooltip({ label: marker.label, x: e.clientX, y: e.clientY });
            }}
            onMouseMove={(e) => {
              setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
            }}
            onMouseLeave={() => {
              setTooltip(null);
            }}
          >
            <g style={{position: 'relative'}}>
              <image
                href="/images/map-pin.png"
                width={12}
                height={12}
                x={-3}
                y={-10.5}
                transform={`rotate(${rotations?.find(r => r[0] === marker.url)?.[1] ?? 0}, -1.5, 0.28)`}
              />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {tooltip && createPortal(
        <div
          className={styles.tooltip}
          style={{ top: tooltip.y + 14, left: tooltip.x + 14 }}
        >
          {tooltip.label}
        </div>,
        document.body
      )}
    </div>
  );
}