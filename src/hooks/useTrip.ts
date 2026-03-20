import { useEffect, useState } from "react";
import { getTrip } from "../api/tripsApi";
import type { Trip } from "../api/models/Trip";

export default function useTrip(slug: string, lang: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getTrip(slug, lang)
      .then((data) => setTrip(data))
      .catch(() => setError("Loading error"))
      .finally(() => setLoading(false));
  }, [slug, lang]);

  return { trip, loading, error };
}