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
  return (
    <div className={styles.placeWrapper}>
      <img src="/icons/bed.png" />
      <span>{place} ({t('trip.nights', { nights })})</span>
      {stayedUrl && <Link to={stayedUrl} target="_blank">Go</Link>}
    </div>
  );
}