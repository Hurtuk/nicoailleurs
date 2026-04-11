import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./CityPage.module.scss";
import useCity from "../../hooks/useCity";
import { CDN } from "../../utils/buildLocalizedUrl";
import TripCard from "../../components/TripCard/TripCard";
import CountryTag from "../../components/CountryTag/CountryTag";
import { usePageMeta, DEFAULT_META } from "../../hooks/usePageMeta";

export default function CityPage() {
  const { i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { city } = useCity(i18n.language, slug ?? '');
  
  usePageMeta(DEFAULT_META);

  return (
    <div className={styles.cityWrapper}>
      {city && (
        <>
          {city.cover && (
            <div className={styles.cover} style={{ backgroundImage: `url(${CDN}/photos/cities/${city.cover})` }}></div>
          )}
          <CountryTag country={city.country!} />
          <h1>{city.name}</h1>
          <div className={styles.trips}>
            {city.trips?.map(trip =>
              <TripCard key={trip.id} trip={trip} tag={trip.startDate.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })} />
            )}
          </div>
        </>
      )}
    </div>
  );
}