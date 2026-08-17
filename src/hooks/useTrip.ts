import { useEffect, useState } from "react";
import { getTrip } from "../api/tripsApi";
import type { Trip } from "../api/models/Trip";

export default function useTrip(slug: string, lang: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    /* Sur /en/, la langue passe de "fr" à "en" au premier rendu : deux requêtes
       partent, et sans ce garde-fou c'est la dernière arrivée — pas la dernière
       demandée — qui s'affiche, d'où un récit français sur la version anglaise. */
    let current = true;

    setLoading(true);
    getTrip(slug, lang)
      .then((data) => { if (current) setTrip(data); })
      .catch(() => { if (current) setError("Loading error"); })
      .finally(() => { if (current) setLoading(false); });

    return () => { current = false; };
  }, [slug, lang]);

  return { trip, loading, error };
}