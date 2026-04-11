import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import useCountry from "../../hooks/useCountry";
import styles from "./CountryPage.module.scss";
import TripCard from "../../components/TripCard/TripCard";
import { usePageMeta, DEFAULT_META } from "../../hooks/usePageMeta";

export default function CountryPage() {
  const { i18n, t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { country } = useCountry(i18n.language, slug ?? '');
  const path = useLocalizedPath();
  
  usePageMeta(DEFAULT_META);

  return (
    <div className={styles.countryWrapper}>
      {country && (
        <>
          <h1>{country.name}</h1>
          <div className={styles.countrySummary}>
            <div className={styles.trips}>
              {country.trips?.map(trip =>
                <TripCard key={trip.id} trip={trip} tag={trip.startDate.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })} />
              )}
            </div>
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