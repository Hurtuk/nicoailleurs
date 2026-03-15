import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import styles from "./CityPage.module.scss";
import TripsList from "../../components/TripsList/TripsList";
import useCity from "../../hooks/useCity";
import { ROOT } from "../../utils/buildLocalizedUrl";

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
          <h1>
            <span className={`fi fi-${city.country!.codeAlpha2.toLowerCase()}`}></span>
            {city.name}
          </h1>
          <Link to={path("countries", city.country!.slug)}>{city.country!.name}</Link>
          <TripsList trips={city.trips} />
        </>
      )}
    </div>
  );
}