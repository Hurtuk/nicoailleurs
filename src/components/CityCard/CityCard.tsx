import { Link } from "react-router-dom";
import styles from "./CityCard.module.scss";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { CDN } from "../../utils/buildLocalizedUrl";
import type { City } from "../../api/models/City";

type Props = {
  city: City;
};

export default function CityCard({ city }: Props) {
  const path = useLocalizedPath();

  return (
    <Link to={path('cities', city.slug)} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={CDN + "/photos/cities/" + city.id + ".jpg"} alt={city.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{city.name}</h4>
      </div>
    </Link>
  );
}