import { useTranslation } from "react-i18next";
import styles from './TableOfContents.module.scss';
import type { Trip } from "../../api/models/Trip";
import { Link } from "react-router-dom";

type Props = {
  trip: Trip;
}

export default function TableOfContents({ trip }: Props) {
  const { i18n, t } = useTranslation();

  return (
    <div className={styles.tableOfContentsWrapper}>
      <h2>{t('trip.tableOfContents')}</h2>
      <ul>
        {trip.chapters.map(chapter => (
          <li key={chapter.number}>
            <Link to={`${chapter.number}`}>
              <span>{chapter.date && t("trip.D")}{chapter.number}</span>
              <div>
                <h3>{chapter.title}</h3>
                <p>{chapter.city}</p>
              </div>
              <span className={styles.chapterDate}>{chapter.date?.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}