import { Link } from "react-router-dom";
import styles from "./TripsList.module.scss";
import type { Trip } from "../../api/models/Trip";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { useTranslation } from "react-i18next";
import { ROOT } from "../../utils/buildLocalizedUrl";

type Props = {
  trips: Trip[] | undefined;
};

export default function TripsList({ trips }: Props) {
  const { t } = useTranslation();

  const path = useLocalizedPath();

  return !trips || trips.length === 0 ? (<p style={{ fontStyle: 'italic', textAlign: 'center' }}>{t('noTrip')}</p>) : (
    <ul className={styles.tripsListWrapper}>{
      trips?.map(trip => (
        <li key={trip.id}>
          <div className={styles.preview} style={{ backgroundImage: `url(${ROOT}/photos/${trip.id}/cover.jpg)` }}></div>
          <div className={styles.data}>
            <span className={styles.tripTitle}>{trip.title}</span>
            <span className={styles.tripExcerpt}>{trip.excerpt}</span>
            <Link to={path('trips', trip.slug)} className={"button " + styles.button}>
              {t('readTheStory')}
            </Link>
          </div>
        </li>
      ))
    }</ul>
  );
}