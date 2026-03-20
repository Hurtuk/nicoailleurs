import { useParams } from "react-router-dom";
import useTrip from "../../hooks/useTrip";
import { useTranslation } from "react-i18next";
import styles from './TripPage.module.scss';
import { ROOT } from "../../utils/buildLocalizedUrl";
import CountryTag from "../../components/CountryTag/CountryTag";

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
                <CountryTag country={country} />
              )}
            </div>
            <h1>{trip.title}</h1>
          </div>
          <div className={styles.tripDetail}>
            <div className={styles.summary}>
              <div>
                <h2>Durée</h2>
                <span>17 jours</span>
              </div>
              <div>
                <h2>Voyageurs</h2>
                <span>2 personnes</span>
              </div>
              <div>
                <h2>Budget total</h2>
                <span>3&nbsp;450&nbsp;€</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}