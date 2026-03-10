import { useParams, Link } from "react-router-dom";
import useTrip from "../../hooks/useTrip";
import { useTranslation } from "react-i18next";
import useLocalizedPath from "../../hooks/useLocalizedPath";

export default function TripPage() {
  const { i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { trip, loading, error } = useTrip(id!, i18n.language);
  const path = useLocalizedPath();

  if (loading) {
    return <div>Chargement du voyage...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!trip) {
    return <div>Voyage introuvable.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Link to={path("trips")} style={{ textDecoration: "none", color: "inherit" }}>
        ← Retour aux voyages
      </Link>

      <h1 style={{ marginTop: "1rem" }}>{trip.title}</h1>

      {/* Ajoute ici les champs de ton objet trip */}
    </div>
  );
}