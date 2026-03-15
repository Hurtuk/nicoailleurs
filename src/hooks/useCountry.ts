import { useEffect, useState } from "react";
import type { Country } from "../api/models/Country";
import { getCountry } from "../api/tripsApi";

interface UseCountryResult {
  country: Country;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export default function useCountry(lang: string, slug: string): UseCountryResult {
  const [country, setCountry] = useState<Country>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refresh = () => setReloadTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    const fetchCountry = async () => {
        setLoading(true);
        setError(null);

        const data = await getCountry(lang, slug);

        if (isMounted) {
          setCountry(data);
        }
    };

    fetchCountry();

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger, lang]);

  return { country: country!, loading, error, refresh };
}