import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from './TripHomepage.module.scss';
import CityCard from "../../../components/CityCard/CityCard";
import CountryMap from "../../../components/CountryMap/CountryMap";
import type { Trip } from "../../../api/models/Trip";

export default function TripPage() {
  const { t } = useTranslation();
  const { trip } = useOutletContext<{ trip: Trip }>();

  return (
    <div className={styles.cities}>
      <CountryMap cities={trip.cities} />
      <h2>{t('trip.cities')}</h2>
      <div>
        {trip.cities.map(city => (
          <CityCard key={city.slug} city={city} />
        ))}
      </div>
    </div>
  );
}