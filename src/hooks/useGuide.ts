import { useEffect, useState } from "react";
import { getGuide } from "../api/tripsApi";
import type { Guide } from "../api/models/Guide";

export default function useGuide(slug: string, lang: string) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    /* Sur /en/, la langue passe de "fr" à "en" au premier rendu : deux requêtes
       partent, et sans ce garde-fou c'est la dernière arrivée — pas la dernière
       demandée — qui s'affiche, d'où un guide français sur la version anglaise. */
    let current = true;

    setLoading(true);
    getGuide(slug, lang)
      .then((data) => { if (current) setGuide(data); })
      .catch(() => { if (current) setError("Loading error"); })
      .finally(() => { if (current) setLoading(false); });

    return () => { current = false; };
  }, [slug, lang]);

  return { guide, loading, error };
}
