import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import styles from "./CityPage.module.scss";
import useCity from "../../hooks/useCity";
import { ROOT } from "../../utils/buildLocalizedUrl";
import TripCard from "../../components/TripCard/TripCard";

export default function CityPage() {
  const { i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { city } = useCity(i18n.language, slug ?? '');
  const path = useLocalizedPath();

  return (
    <div className={styles.cityWrapper}>
      {city && (
        <>
          {city.cover && (
            <div className={styles.cover} style={{ backgroundImage: `url(${ROOT}/photos/cities/${city.cover})` }}></div>
          )}
          <Link to={path("countries", city.country!.slug)} className={styles.cityCountry}>
            <span className={`fi fi-${city.country!.codeAlpha2.toLowerCase()}`}></span>
            {city.country!.name}
          </Link>
          <h1>
            {city.name}
          </h1>
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