// ChapterPage.tsx
import { useOutletContext, Link } from "react-router-dom";
import type { Trip } from "../../../api/models/Trip";
import styles from './CostsPage.module.scss';
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../hooks/useCurrency";

export default function ChapterPage() {
  const { t } = useTranslation();
  const { trip } = useOutletContext<{ trip: Trip }>();
  const formatCurrency = useCurrency();

  const total = trip.budgets.reduce((acc, current) => acc + (current.forOne ? current.amount : current.amount / trip.people), 0);

  return (
    <div className={styles.costsWrapper}>
      <Link to=".." className={styles.backLink}>{t('trip.back')}</Link>
      <h2>{t('trip.total_budget')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('trip.budget.title')}</th>
            <th>{t('trip.budget.cost')}</th>
            {trip.people > 1 && <th>{t('trip.budget.costPerPerson')}</th>}
          </tr>
        </thead>
        <tbody>
          {trip.budgets.map(budget => (
            <tr key={budget.id}>
              <td>{budget.title}</td>
              <td>{budget.forOne ? '-' : formatCurrency(budget.amount)}</td>
              {trip.people > 1 && <td>{formatCurrency(budget.forOne ? budget.amount : (budget.amount / trip.people))}</td>}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={trip.people > 1 ? 2 : 1} style={{textAlign: 'left'}}>{t('trip.budget.total')}</th>
            <th>{formatCurrency(total)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}