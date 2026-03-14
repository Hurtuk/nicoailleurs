import { useMemo } from "react";
import useTrips from "../../hooks/useTrips";
import TripCard from "../../components/TripCard/TripCard";
import { useTranslation } from "react-i18next";
import type { Trip } from "../../api/models/Trip";
import styles from "./TripsPage.module.scss";
import React from "react";

export default function TripsPage() {
  const { i18n, t } = useTranslation();
  const { trips } = useTrips(i18n.language);

  const tripsByYear = useMemo(() => {
    return trips.reduce<{ [year: string]: Trip[] }>((acc, trip) => {
      const year = trip.startDate.getFullYear().toString();
      (acc[year] ??= []).push(trip);
      return acc;
    }, {});
  }, [trips]);

  return (
    <div className={styles.tripsWrapper}>
      <h1>{t('header.stories')}</h1>
      {Object.entries(tripsByYear)
        .sort(([y1], [y2]) => y2.localeCompare(y1))
        .map(([year, tripsList]) => (
          <React.Fragment key={year}>
            <h2 className={styles.year}>{year}</h2>
            <div className="trips-wrapper">
              {tripsList.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}