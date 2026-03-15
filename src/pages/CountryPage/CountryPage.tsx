import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import useCountry from "../../hooks/useCountry";
import styles from "./CountryPage.module.scss";
import TripsList from "../../components/TripsList/TripsList";

export default function CountryPage() {
  const { i18n, t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { country } = useCountry(i18n.language, slug ?? '');
  const path = useLocalizedPath();

  return (
    <div className={styles.countryWrapper}>
      {country && (
        <>
          <h1>{country.name}</h1>
          <div className={styles.countrySummary}>
            <TripsList trips={country.trips} />
            <aside>
              <span className={`fi fi-${country.codeAlpha2.toLowerCase()}`}></span>
              <div className={styles.days}>{t('country.days', { count: country.days })}</div>
              <div className={styles.cities}>
                <h2>{t('country.cities')}</h2>
                <ul>{country.cities?.map(city => (
                  <li key={city.id}>
                    <Link to={path('cities', city.slug)}>{city.name}</Link>
                  </li>
                ))}</ul>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}