import { SUPPORTED_LANGS } from "../i18n";

export const ROOT = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ? "https://louiecinephile.fr/nicoailleurs" : "";

export const ROUTES: {[lang: string]: any} = {
  fr: { "/": "", countries: "pays", cities: "villes", trips: "voyages", guides: "guides" },
  en: { "/": "", countries: "countries", cities: "cities", trips: "trips", guides: "guides" },
};

type Lang = keyof typeof ROUTES;
type RouteKey = keyof typeof ROUTES.fr;

// Segment → clé de route (ex: "pays" → "countries", "countries" → "countries")
function findRouteKey(segment: string): RouteKey | null {
  for (const lang of Object.values(ROUTES)) {
    const found = Object.entries(lang).find(([, v]) => v === segment);
    if (found) return found[0] as RouteKey;
  }
  return null;
}

export function buildLocalizedUrl(pathname: string, targetLang: Lang): string {
  const segments = pathname.split('/').filter(Boolean);

  // Retirer le préfixe de langue s'il existe
  if (SUPPORTED_LANGS.includes(segments[0])) {
    segments.shift();
  }

  // Traduire chaque segment
  const translatedSegments = segments.map((segment, i) => {
    if (i === 0) {
      const key = findRouteKey(segment);
      return key ? ROUTES[targetLang][key] : segment;
    }
    return segment; // les slugs (ex: nom de pays) restent inchangés
  });

  const prefix = targetLang !== "fr" ? `/${targetLang}` : "";
  return `${prefix}/${translatedSegments.join("/")}`;
}