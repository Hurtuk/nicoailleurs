import styles from "./HomePage.module.scss";
import MapSection from "../../components/HomeSections/MapSection/MapSection";
import LastTripsSection from "../../components/HomeSections/LastTripsSection/LastTripsSection";
import WelcomeSection from "../../components/HomeSections/WelcomeSection/WelcomeSection";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <MapSection />
      <LastTripsSection />
      <WelcomeSection />
    </main>
  );
}