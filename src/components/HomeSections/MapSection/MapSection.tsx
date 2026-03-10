import { useTranslation } from "react-i18next";
import WorldMap, { type PlaceConfig } from "../../WorldMap/WorldMap";
import styles from "./MapSection.module.scss";
import { useEffect, useState } from "react";
import useVisitedCountries from "../../../hooks/useVisitedCountries";
import useVisitedCities from "../../../hooks/useVisitedCities";
import useLocalizedPath from "../../../hooks/useLocalizedPath";

export default function HomePage() {
  const { i18n } = useTranslation();
  const { countries } = useVisitedCountries(i18n.language);
  const { cities } = useVisitedCities(i18n.language);

  const [countryConfig, setCountryConfig] = useState({});
  const [markers, setMarkers] = useState([] as PlaceConfig[]);

  const path = useLocalizedPath();

  useEffect(() => {
    const countriesByNum: any = {};
    for (const country of countries) {
      countriesByNum[country.num] = {
        label: country.name,
        url: path("countries", country.path)
      };
    }
    setCountryConfig(countriesByNum);
  }, [countries]);

  useEffect(() => {
    setMarkers(cities.filter(city => !city.hideOnMap).map(
      city => ({
        url: path("cities", city.path),
        label: city.name,
        coordinates: [city.longitude, city.latitude]
      })
    ));
  }, [cities]);

  return (
    <section className={styles.mapSection}>
      <WorldMap countryConfig={countryConfig} markers={markers} />
    </section>
  );
}