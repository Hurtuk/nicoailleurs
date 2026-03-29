import { useTranslation } from "react-i18next";
import styles from './TripSummary.module.scss';
import { useCurrency } from "../../hooks/useCurrency";
import type { Trip } from "../../api/models/Trip";
import { Link } from "react-router-dom";

type Props = {
  trip: Trip;
}

export default function TripSummary({ trip }: Props) {
  const { t } = useTranslation();
  const formatCurrency = useCurrency();

  const totalBudget = trip.budgets.reduce((acc, current) => acc + (current.forOne ? current.amount : current.amount / trip.people), 0);

  return (
    <div className={styles.tripSummary}>
      <div className={styles.duration}>
        <h2>{t('trip.duration')}</h2>
        <span>{t('trip.days', { count: trip.days })}</span>
      </div>
      <div className={styles.people}>
        <h2>{t('trip.travelers')}</h2>
        <span>{t('trip.people', { count: trip.people })}</span>
      </div>
      {trip.budgets?.length ? (
        <div className={styles.budget}>
          <h2>{t(trip.people > 1 ? 'trip.budget_per_person' : 'trip.total_budget')}</h2>
          <div>
            <span>{formatCurrency(totalBudget)}</span>
            <Link to={"budget"}>{t('trip.seeBudget')}</Link>
          </div>
        </div>
      ) : ''}
      {trip.album && (
        <div className={styles.album}>
          <h2>{t(trip.people > 1 ? 'trip.album' : 'trip.album')}</h2>
          <Link to={trip.album} target="_blank">
            <img src="/icons/photos.png" />
          </Link>
        </div>
      )}
    </div>
  );
}