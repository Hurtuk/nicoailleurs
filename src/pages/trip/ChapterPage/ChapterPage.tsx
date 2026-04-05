import { useParams, useOutletContext, Link } from "react-router-dom";
import type { Trip } from "../../../api/models/Trip";
import styles from './ChapterPage.module.scss';
import { useTranslation } from "react-i18next";
import { formatContent, grammarRules } from "../../../utils/formatContent";
import StayPlace from "../../../components/StayPlace/StayPlace";
import { useEffect, useRef, useState } from "react";
import useLocalizedPath from "../../../hooks/useLocalizedPath";

export default function ChapterPage() {
  const { t, i18n } = useTranslation();
  const { chapterIndex } = useParams<{ chapterIndex: string }>();
  const { trip } = useOutletContext<{ trip: Trip }>();
  const path = useLocalizedPath();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const index = parseInt(chapterIndex!) - 1; // /1 → index 0
  const chapter = trip.chapters[index];
  
  useEffect(() => {
    setVisible(false);
    const show = setTimeout(() => setVisible(true), 50);
    wrapperRef.current?.scrollIntoView({ behavior: "smooth" })
    return () => {
      clearTimeout(show);
    };
  }, [index]);

  if (!chapter) return <div>Chapitre introuvable</div>;

  return (
    <div className={styles.chapterWrapper}>
      <div className={styles.anchor} ref={wrapperRef}></div>
      <Link to=".." className={styles.backLink}>{t('trip.back')}</Link>
      <div
        className={styles.chapterContent}
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease' }}
      >
        <h2>
          <span>{`${t('trip.chapter')} ${chapter.number}`}</span>
          {grammarRules(i18n.language, chapter.title)}
        </h2>
        <div className={styles.dayData}>
          <span>{chapter.date?.toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>{chapter.city && <Link to={path("cities", chapter.citySlug)} className={styles.backLink}>{chapter.city}</Link>}</span>
        </div>
        {!chapter.date && chapter.place && <StayPlace nights={chapter.nights} place={chapter.place} stayedUrl={chapter.stayedUrl} />}
        {formatContent(i18n.language, trip.id, chapter.content, chapter.cityFrom, chapter.cityTo, chapter.transport)}
        {chapter.date && chapter.place && <StayPlace nights={chapter.nights} place={chapter.place} stayedUrl={chapter.stayedUrl} />}
        <footer>
          <Link to={`../${chapter.number - 1}`}>{chapter.number > 1 && t('trip.previous')}</Link>
          <Link to={`../${chapter.number + 1}`}>{chapter.number < trip.chapters.length && t('trip.next')}</Link>
        </footer>
      </div>
    </div>
  );
}