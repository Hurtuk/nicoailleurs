import { Link } from "react-router-dom";
import useTrips from "../../hooks/useTrips";
import TripCard from "../../components/TripCard/TripCard";
import { useTranslation } from "react-i18next";

export default function TripsPage() {
  const { i18n } = useTranslation();
  const { trips, loading, error } = useTrips(i18n.language);

  if (loading) {
    return <div>Chargement des voyages...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!trips.length) {
    return <div>Aucun voyage trouvé.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mes voyages</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {trips.map((trip) => (
          <Link
            key={trip.id}
            to={`/trips/${trip.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <TripCard trip={trip} />
          </Link>
        ))}
      </div>
    </div>
  );
}