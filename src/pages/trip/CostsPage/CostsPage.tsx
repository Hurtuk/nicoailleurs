// ChapterPage.tsx
import { useOutletContext, Link } from "react-router-dom";
import type { Trip } from "../../../api/models/Trip";
import styles from './CostsPage.module.scss';
import { useTranslation } from "react-i18next";

export default function ChapterPage() {
  const { t } = useTranslation();
  const { trip } = useOutletContext<{ trip: Trip }>();

  return (
    <div className={styles.costsWrapper}>
      <Link to=".." className={styles.backLink}>{t('trip.back')}</Link>
      <h2>{t(trip.people > 1 ? 'trip.budget_per_person' : 'trip.total_budget')}</h2>
      <ul>
        
      </ul>
    </div>
  );
}