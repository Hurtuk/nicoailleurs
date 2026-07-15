import { useMemo, useState } from "react";
import useTrips from "../../hooks/useTrips";
import TripCard from "../../components/TripCard/TripCard";
import { useTranslation } from "react-i18next";
import type { Trip } from "../../api/models/Trip";
import styles from "./TripsPage.module.scss";
import { useSearchParams } from "react-router-dom";
import type { Tag as TagModel } from "../../api/models/Tag";
import Tag from "../../components/Tag/Tag";
import { usePageMeta, DEFAULT_META } from "../../hooks/usePageMeta";

export default function TripsPage() {
  const { i18n, t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') ?? undefined;
  const { trips } = useTrips(i18n.language, { tag });

  const [tagObject, setTagObject] = useState<TagModel>();
  
  usePageMeta(DEFAULT_META);

  const tripsByYear = useMemo(() => {
    setTagObject(trips[0]?.tags?.find(t => t.slug === tag));
    return trips.reduce<{ [year: string]: Trip[] }>((acc, trip) => {
      const year = trip.startDate.getFullYear().toString();
      (acc[year] ??= []).push(trip);
      return acc;
    }, {});
  }, [trips]);

  return (
    <div className={styles.tripsWrapper}>
      <h1>{t('header.stories')}</h1>
      {tagObject && <h2>Tag : <Tag tag={tagObject} clickToRemove /></h2>}
      <div className={styles.trips}>
        {Object.entries(tripsByYear)
          .sort(([y1], [y2]) => y2.localeCompare(y1))
          .map(([year, tripsList]) => (
            <div key={year} className={tripsList.length <= 2 ? styles.oldTrip : ''}>
              <h2 className={styles.year}>{year}</h2>
              <div className="trips-wrapper">
                {tripsList.map((trip) => (
                  <TripCard key={trip.id} trip={trip} tag={trip.startDate.toLocaleDateString(i18n.language, { month: 'long' })} />
                ))}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}