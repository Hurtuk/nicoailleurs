import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import styles from "./ContinentsPage.module.scss";
import useVisitedCountries from "../../hooks/useVisitedCountries";
import type { Country } from "../../api/models/Country";
import { Link } from "react-router-dom";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { usePageMeta, DEFAULT_META } from "../../hooks/usePageMeta";

export default function ContinentsPage() {
  const { i18n, t } = useTranslation();
  const { countries } = useVisitedCountries(i18n.language);
  
  const path = useLocalizedPath();
  
  usePageMeta(DEFAULT_META);

  const countriesByContinent = useMemo(() => {
    return countries.reduce<{ [continent: string]: Country[] }>((acc, country) => {
      if (!country.future) {
        (acc[country.continent] ??= []).push(country);
      }
      return acc;
    }, {});
  }, [countries]);

  return (
    <div className={styles.countriesWrapper}>
      <h1>{t('header.countries')}</h1>
      {Object.entries(countriesByContinent).map(([continentName, countriesList]) => (
        <div className={styles.continent} key={continentName}>
          <h2>{continentName}</h2>
          <ul>
            {countriesList.map((country) => (
              <li key={country.name}>
                <Link to={path('countries', country.slug)}>
                  {country.name}
                  {(country.count ?? 1) > 1 && ` (${country.count})`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}