// ChapterPage.tsx
import { Link } from "react-router-dom";
import styles from './StayPlace.module.scss';
import { useTranslation } from "react-i18next";

type Props = {
  nights?: number;
  stayedUrl?: string;
  place?: string;
};

export default function StayPlace({ nights, stayedUrl, place }: Props) {
  const { t } = useTranslation();

  const website = stayedUrl?.indexOf('booking') !== -1 ? 'Booking' : stayedUrl?.indexOf('airbnb') !== -1 ? 'Airbnb' : t('link');

  return (
    <div className={styles.placeWrapper}>
      <img src="/icons/bed.png" />
      <span>{place?.split("\n")[0]} ({t('trip.nights', { count: nights })})</span>
      {stayedUrl && <Link to={stayedUrl} target="_blank" className={styles[website.toLocaleLowerCase()]}>
        {website}
      </Link>}
    </div>
  );
}