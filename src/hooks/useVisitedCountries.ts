import { useEffect, useState } from "react";
import { getVisitedCountries } from "../api/tripsApi";
import type { Country } from "../api/models/Country";

interface UseVisitedCountriesResult {
  countries: Country[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export default function useVisitedCountries(lang: string): UseVisitedCountriesResult {
  const [countries, setCountries] = useState<Country[]>([]);
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

        const data = await getVisitedCountries(lang);

        if (isMounted) {
          setCountries(data);
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

  return { countries, loading, error, refresh };
}