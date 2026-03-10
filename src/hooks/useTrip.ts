import { useEffect, useState } from "react";
import { getTrip } from "../api/tripsApi";
import type { Trip } from "../api/models/Trip";

export default function useTrip(id: string | number, lang: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getTrip(id, lang)
      .then((data) => setTrip(data))
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  return { trip, loading, error };
}