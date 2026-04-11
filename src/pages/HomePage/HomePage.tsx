import styles from "./HomePage.module.scss";
import MapSection from "../../components/HomeSections/MapSection/MapSection";
import LastTripsSection from "../../components/HomeSections/LastTripsSection/LastTripsSection";
import WelcomeSection from "../../components/HomeSections/WelcomeSection/WelcomeSection";
import { DEFAULT_META, usePageMeta } from "../../hooks/usePageMeta";

export default function HomePage() {
  usePageMeta(DEFAULT_META);
  
  return (
    <main className={styles.page}>
      <MapSection />
      <LastTripsSection />
      <WelcomeSection />
    </main>
  );
}