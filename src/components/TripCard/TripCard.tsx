import { Link } from "react-router-dom";
import styles from "./TripCard.module.scss";
import type { Trip } from "../../api/models/Trip";
import useLocalizedPath from "../../hooks/useLocalizedPath";

type Props = {
  trip: Trip;
};

export default function TripCard({ trip }: Props) {

  const path = useLocalizedPath();

  const root = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ? "https://nicoailleurs.com" : "";

  return (
    <Link to={path('trips', trip.id)} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={root + "/photos/" + trip.id + "/cover.jpg"} alt={trip.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.country}>{trip.place}</span>
        <h3 className={styles.title}>{trip.title}</h3>
        <p className={styles.excerpt}>{trip.excerpt}</p>
      </div>
    </Link>
  );
}