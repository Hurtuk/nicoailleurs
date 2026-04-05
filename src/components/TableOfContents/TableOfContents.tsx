import { useTranslation } from "react-i18next";
import styles from './TableOfContents.module.scss';
import type { Trip } from "../../api/models/Trip";
import { NavLink } from "react-router-dom";
import { grammarRules } from "../../utils/formatContent";

type Props = {
  trip: Trip;
}

function datediff(first: Date, second: Date): number {        
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}

export default function TableOfContents({ trip }: Props) {
  const { i18n, t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? styles.active : ""}`.trim();

  const allHaveDates = trip.chapters.filter(c => !!c.date).length === trip.chapters.length - 2;
  const cities = trip.chapters.map((chapter, index) => 
    index === 0 || chapter.city !== trip.chapters[index - 1].city ? chapter.city : ''
  );

  let chapterNumber = 0;

  return (
    <div className={styles.tableOfContentsWrapper}>
      <h2>{t('trip.tableOfContents')}</h2>
      <ul>
        {trip.chapters.map((chapter, index, chapters) => {
          let numberToDisplay: string | number = '';
          let sameDay = false;
          if (chapter.number != 1 && chapter.number != chapters.length) {
            if (allHaveDates) {
              if (chapters[index - 1].date?.getDate() != chapter.date?.getDate()) {
                chapterNumber += !chapters[index - 1].date ? 1 : datediff(chapters[index - 1].date!, chapter.date!);
                numberToDisplay = t("trip.D") + chapterNumber;
              } else {
                sameDay = true;
                numberToDisplay = "";
              }
            } else {
              chapterNumber++;
              numberToDisplay = chapterNumber;
            }
          }
          return (
            <li key={chapter.number}>
              <NavLink to={`${chapter.number}`} className={navLinkClass}>
                <span className={sameDay ? styles.sameDay : ''}>{numberToDisplay}</span>
                <div>
                  <h3>{grammarRules(i18n.language, chapter.title)}</h3>
                  <p>{cities[index]}</p>
                </div>
                <span className={styles.chapterDate}>{chapter.date?.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </div>
  );
}