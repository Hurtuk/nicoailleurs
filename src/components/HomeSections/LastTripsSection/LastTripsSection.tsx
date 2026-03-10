import { useMemo } from "react";
import useTrips from "../../../hooks/useTrips";
import i18n from "../../../i18n";
import TripCard from "../../TripCard/TripCard";
import styles from "./LastTripsSection.module.scss";
import { Link } from "react-router-dom";
import useLocalizedPath from "../../../hooks/useLocalizedPath";
import { useTranslation } from "react-i18next";

export default function LastTripsSection() {
  const { t } = useTranslation();

  const filters = useMemo(() => ({ limit: 3, sortBy: 'startDate', sort: 'DESC' }), []);
  const path = useLocalizedPath();
  
  const { trips } = useTrips(i18n.language, filters);
  
  return (
    <section className={styles.wrapper}>
      <h2>{t('home.lastTrips')}</h2>
      <div className={styles.cards}>
        {trips.map(trip => 
          <TripCard key={trip.id} trip={trip} />
        )}
      </div>
      <div className={styles.cto}>
        <Link to={path("trips")} className="button">{ t('cto.allStories')} →</Link>
      </div>
    </section>
  )
}