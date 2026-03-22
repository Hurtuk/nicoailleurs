// ChapterPage.tsx
import { useParams, useOutletContext, Link } from "react-router-dom";
import type { Trip } from "../../../api/models/Trip";
import styles from './ChapterPage.module.scss';
import { useTranslation } from "react-i18next";
import { formatContent } from "../../../utils/formatContent";
import StayPlace from "../../../components/StayPlace/StayPlace";

export default function ChapterPage() {
  const { t } = useTranslation();
  const { chapterIndex } = useParams<{ chapterIndex: string }>();
  const { trip } = useOutletContext<{ trip: Trip }>();

  const index = parseInt(chapterIndex!) - 1; // /1 → index 0
  const chapter = trip.chapters[index];

  if (!chapter) return <div>Chapitre introuvable</div>;

  return (
    <div className={styles.chapterWrapper}>
      <Link to=".." className={styles.backLink}>{t('trip.back')}</Link>
      <h2>
        <span>{`${t('trip.chapter')} ${chapter.number}`}</span>
        {chapter.title}
      </h2>
      {!chapter.date && chapter.place && <StayPlace nights={chapter.nights} place={chapter.place} stayedUrl={chapter.stayedUrl} />}
      {formatContent(chapter.content)}
      {chapter.date && chapter.place && <StayPlace nights={chapter.nights} place={chapter.place} stayedUrl={chapter.stayedUrl} />}
      <footer>
        <Link to={`../${chapter.number - 1}`}>{chapter.number > 1 && t('trip.previous')}</Link>
        <Link to={`../${chapter.number + 1}`}>{chapter.number < trip.chapters.length && t('trip.next')}</Link>
      </footer>
    </div>
  );
}