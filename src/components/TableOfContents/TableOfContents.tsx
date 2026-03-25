import { useTranslation } from "react-i18next";
import styles from './TableOfContents.module.scss';
import type { Trip } from "../../api/models/Trip";
import { NavLink } from "react-router-dom";

type Props = {
  trip: Trip;
}

export default function TableOfContents({ trip }: Props) {
  const { i18n, t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? styles.active : ""}`.trim();

  const allHaveDates = trip.chapters.filter(c => !!c.date).length === trip.chapters.length - 2;

  return (
    <div className={styles.tableOfContentsWrapper}>
      <h2>{t('trip.tableOfContents')}</h2>
      <ul>
        {trip.chapters.map(chapter => (
          <li key={chapter.number}>
            <NavLink to={`${chapter.number}`} className={navLinkClass}>
              <span>{
                allHaveDates
                ? (chapter.number == 1 || chapter.number == trip.chapters.length ? '' : (t("trip.D") + (chapter.number - 1)))
                : chapter.number
              }</span>
              <div>
                <h3>{chapter.title}</h3>
                <p>{chapter.city}</p>
              </div>
              <span className={styles.chapterDate}>{chapter.date?.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}