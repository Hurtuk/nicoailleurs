import { useParams } from "react-router-dom";
import useTrip from "../../hooks/useTrip";
import { useTranslation } from "react-i18next";
import styles from './TripPage.module.scss';
import { ROOT } from "../../utils/buildLocalizedUrl";
import CountryTag from "../../components/CountryTag/CountryTag";
import TripSummary from "../../components/TripSummary/TripSummary";

export default function TripPage() {
  const { i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { trip } = useTrip(id!, i18n.language);

  return (
    <div className={styles.tripWrapper}>
      {trip && (
        <>
          <div className={styles.banner} style={{ backgroundImage: `url(${ROOT}/photos/${trip.id}/banner.jpg)` }}>
            <div>
              {trip.countries.map(country => 
                <CountryTag key={country.slug} country={country} />
              )}
            </div>
            <h1>{trip.title}</h1>
            <div className={styles.dates}>
              <span>{trip.startDate.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              →
              <span>{trip.endDate.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
          </div>
          <div className={styles.tripDetail}>
            <TripSummary trip={trip} />
          </div>
        </>
      )}
    </div>
  );
}