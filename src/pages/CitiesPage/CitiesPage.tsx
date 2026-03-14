import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import styles from "./CitiesPage.module.scss";
import useVisitedCities from "../../hooks/useVisitedCities";
import { Link } from "react-router-dom";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import type { City } from "../../api/models/City";
import unaccentName from "../../utils/unaccentName";

export default function CitiesPage() {
  const { i18n, t } = useTranslation();
  const { cities } = useVisitedCities(i18n.language);
  
  const path = useLocalizedPath();

  const countriesByLetter = useMemo(() => {
    return cities
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
      .reduce<{ [letter: string]: City[] }>((acc, city) => {
        (acc[unaccentName(city.name[0])] ??= []).push(city);
        return acc;
      }, {});
  }, [cities]);

  return (
    <div className={styles.citiesWrapper}>
      <h1>{t('header.cities')}</h1>
      <div className={styles.letters}>
        {Object.entries(countriesByLetter).map(([letter, citiesList]) => (
          <div className={styles.letter} key={letter}>
            <h2>{letter}</h2>
            <ul>
              {citiesList.map((city) => (
                <li key={city.name}>
                  <Link to={path('countries', city.path)}>
                    {city.name}
                    {(city.count ?? 1) > 1 && ` (${city.count})`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}