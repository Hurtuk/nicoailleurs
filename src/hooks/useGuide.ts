import { useEffect, useState } from "react";
import { getGuide } from "../api/tripsApi";
import type { Guide } from "../api/models/Guide";

export default function useGuide(slug: string, lang: string) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getGuide(slug, lang)
      .then((data) => setGuide(data))
      .catch(() => setError("Loading error"))
      .finally(() => setLoading(false));
  }, [slug, lang]);

  return { guide, loading, error };
}
