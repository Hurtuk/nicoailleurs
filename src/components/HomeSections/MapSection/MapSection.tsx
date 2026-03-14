import { useTranslation } from "react-i18next";
import WorldMap, { type PlaceConfig } from "../../WorldMap/WorldMap";
import styles from "./MapSection.module.scss";
import { useEffect, useMemo, useState } from "react";
import useVisitedCountries from "../../../hooks/useVisitedCountries";
import useVisitedCities from "../../../hooks/useVisitedCities";
import useLocalizedPath from "../../../hooks/useLocalizedPath";

export default function HomePage() {
  const { i18n } = useTranslation();
  const { countries } = useVisitedCountries(i18n.language);
  const { cities } = useVisitedCities(i18n.language);

  const path = useLocalizedPath();

  const countryConfig = useMemo(() => {
    return Object.fromEntries(
      countries.map(country => [
        country.num,
        { label: country.name, url: path("countries", country.path) }
      ])
    );
  }, [countries, path]);

  const markers = useMemo<PlaceConfig[]>(() => {
    return cities
      .filter(city => !city.hideOnMap)
      .map(city => ({
        url: path("cities", city.path),
        label: city.name,
        coordinates: [city.longitude, city.latitude]
      }));
  }, [cities, path]);

  return (
    <section className={styles.mapSection}>
      <WorldMap countryConfig={countryConfig} markers={markers} />
    </section>
  );
}