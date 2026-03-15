import { useEffect, useState } from "react";
import type { City } from "../api/models/City";
import { getCity } from "../api/tripsApi";

interface UseCityResult {
  city: City;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export default function useCity(lang: string, slug: string): UseCityResult {
  const [city, setCity] = useState<City>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refresh = () => setReloadTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    const fetchCity = async () => {
        setLoading(true);
        setError(null);

        const data = await getCity(lang, slug);

        if (isMounted) {
          setCity(data);
        }
    };

    fetchCity();

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger, lang]);

  return { city: city!, loading, error, refresh };
}