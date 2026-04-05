import { Link } from "react-router-dom";
import styles from "./TripCard.module.scss";
import type { Trip } from "../../api/models/Trip";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { CDN } from "../../utils/buildLocalizedUrl";
import { useTranslation } from "react-i18next";
import { grammarRules } from "../../utils/formatContent";

type Props = {
  trip: Trip;
  tag?: string;
};

export default function TripCard({ trip, tag }: Props) {
  const { i18n } = useTranslation();
  const path = useLocalizedPath();

  return (
    <Link to={path('trips', trip.slug)} className={styles.card}>
      {tag && <span className={styles.dateTag}>{tag}</span>}
      <div className={styles.imageWrapper}>
        <img src={CDN + "/photos/" + trip.id + "/cover.jpg"} alt={trip.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.country}>{trip.place}</span>
        <h3 className={styles.title}>{grammarRules(i18n.language, trip.title)}</h3>
        <p className={styles.excerpt}>{trip.excerpt}</p>
      </div>
    </Link>
  );
}