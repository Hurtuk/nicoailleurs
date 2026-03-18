import { Link } from "react-router-dom";
import styles from "./TripCard.module.scss";
import type { Trip } from "../../api/models/Trip";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { ROOT } from "../../utils/buildLocalizedUrl";

type Props = {
  trip: Trip;
  tag?: string;
};

export default function TripCard({ trip, tag }: Props) {
  const path = useLocalizedPath();

  return (
    <Link to={path('trips', trip.slug)} className={styles.card}>
      {tag && <span className={styles.dateTag}>{tag}</span>}
      <div className={styles.imageWrapper}>
        <img src={ROOT + "/photos/" + trip.id + "/cover.jpg"} alt={trip.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.country}>{trip.place}</span>
        <h3 className={styles.title}>{trip.title}</h3>
        <p className={styles.excerpt}>{trip.excerpt}</p>
      </div>
    </Link>
  );
}