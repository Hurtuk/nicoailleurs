import { useEffect, useState } from "react";
import { getVisitedCities } from "../api/tripsApi";
import type { City } from "../api/models/City";

interface UseVisitedCitiesResult {
  cities: City[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export default function useVisitedCities(lang: string): UseVisitedCitiesResult {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refresh = () => setReloadTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVisitedCities(lang);

        if (isMounted) {
          setCities(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erreur lors du chargement des voyages.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger, lang]);

  return { cities, loading, error, refresh };
}