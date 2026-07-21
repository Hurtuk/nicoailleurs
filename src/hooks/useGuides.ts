import { useEffect, useState } from "react";
import { getGuides } from "../api/tripsApi";
import type { Guide } from "../api/models/Guide";

export default function useGuides(lang: string) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    getGuides(lang)
      .then((data) => { if (isMounted) setGuides(data); })
      .catch(() => { if (isMounted) setError("Erreur lors du chargement des guides."); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [lang]);

  return { guides, loading, error };
}
