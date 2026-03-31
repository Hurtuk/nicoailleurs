// ChapterPage.tsx
import { Link } from "react-router-dom";
import styles from './Hike.module.scss';
import { useTranslation } from "react-i18next";
import { ROOT } from "../../utils/buildLocalizedUrl";

type Props = {
  title: string;
  url: string;
  distance: number;
  height: number;
  idTrip?: string;
};

export default function Hike({ title, url, distance, height, idTrip }: Props) {
  const { t } = useTranslation();

  const website = url?.indexOf('visorando') !== -1 ? 'Visorando' : url?.indexOf('alltrails') !== -1 ? 'Alltrails' : t('gpx');

  return (
    <div className={styles.hikeWrapper}>
      <img src="/icons/hike.png" />
      <div>
        <span>{title}</span>
        <span>{distance.toLocaleString()} km</span>
        <span>{height.toLocaleString()} m D+</span>
      </div>
      <Link to={url.indexOf('http') ? url : `${ROOT}/photos/${idTrip}/${url}`} target="_blank" className={styles[website.toLocaleLowerCase()]}>
        {website}
      </Link>
    </div>
  );
}