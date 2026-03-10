import { useEffect, useState } from "react";
import { getTrips } from "../api/tripsApi";
import type { Trip } from "../api/models/Trip";

interface UseTripsResult {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

interface Filters {
  limit?: number;
  sortBy?: string;
  sort?: string;
  country?: string;
  city?: string;
}

export default function useTrips(lang: string, filters?: Filters): UseTripsResult {
  const [trips, setTrips] = useState<Trip[]>([]);
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

        const data = await getTrips(lang, filters);

        if (isMounted) {
          setTrips(data);
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
  }, [reloadTrigger, lang, filters]);

  return { trips, loading, error, refresh };
}