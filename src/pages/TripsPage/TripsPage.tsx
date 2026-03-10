import useTrips from "../../hooks/useTrips";
import TripCard from "../../components/TripCard/TripCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { Trip } from "../../api/models/Trip";
import styles from "./TripsPage.module.scss";

export default function TripsPage() {
  const { i18n, t } = useTranslation();
  const { trips } = useTrips(i18n.language);

  const [tripsByYear, setTripsByYear] = useState({} as {[year: string]: Trip[]});

  useEffect(() => {
    const sorted: any = {};
    trips.forEach(trip => {
      const year = trip.startDate.getFullYear();
      if (!sorted[year]) {
        sorted[year] = [];
      }
      sorted[year].push(trip);
    });
    setTripsByYear(sorted);
  }, [trips])

  return (
    <div className={styles.tripsWrapper} style={{ padding: "2rem" }}>
      <h1>{t('header.stories')}</h1>
      {Object.entries(tripsByYear)
        .sort((y1, y2) => y2[0].localeCompare(y1[0]))
        .map(year => (
          <>
            <h2 className={styles.year}>{year[0]}</h2>
            <div className="trips-wrapper">
              {year[1]!.map((trip) => (
                <TripCard trip={trip} />
              ))}
            </div>
          </>
      ))}
    </div>
  );
}