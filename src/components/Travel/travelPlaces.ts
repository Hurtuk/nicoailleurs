/*
 *  Où se trouvent les deux villes d'un trajet.
 *
 *  Les villes du voyage portent déjà leurs coordonnées : c'est la source la plus
 *  sûre, et elle ne coûte aucune requête. Reste le cas de la ville de départ du
 *  premier trajet — Paris, Beauvais, Charleroi… — qui n'appartient à aucun
 *  voyage : celle-là est localisée par le géocodeur d'Open-Meteo (sans clé, CORS
 *  ouvert, noms traduits), puis conservée dans le stockage local.
 */
import type { City } from '../../api/models/City';
import type { Endpoint } from './routeMap';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const CACHE_PREFIX = 'nicoailleurs.place.';

function fold(name: string) {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** La ville parmi celles du voyage, aux accents et à la casse près. */
function fromTrip(name: string, cities: City[]): Endpoint | null {
  const wanted = fold(name);
  const city = cities.find(c => fold(c.name) === wanted);
  if (!city) return null;

  const lat = parseFloat(city.latitude);
  const lon = parseFloat(city.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return { name, lat, lon };
}

/*
 *  Un lieu n'est pas toujours un nom de ville nu : il peut porter une précision
 *  (« Bangkok, Thaïlande », « Aéroport de Beauvais - Tillé »). Le géocodeur, lui,
 *  n'accepte qu'un nom : on essaie la chaîne entière, puis chacun de ses
 *  morceaux, du plus probable au moins probable.
 */
function variants(name: string) {
  const list = [name];
  for (const part of name.split(/[,;/\-–]/)) {
    const piece = part.trim();
    // Deux lettres ne font pas une ville : « Aix-en-Provence » ne doit pas se
    // replier sur « en ».
    if (piece.length > 2 && !list.includes(piece)) list.push(piece);
  }
  return list;
}

type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  population?: number;
};

/*
 *  Le géocodeur classe par ressemblance de chaîne, ce qui met parfois un hameau
 *  homonyme devant la ville connue : « Busan » renvoie d'abord deux bourgs avant
 *  le port de trois millions d'habitants, orthographié « Pusan ». La population
 *  tranche mieux, le nom exact ne servant qu'à départager les lieux sans
 *  population connue.
 */
function bestResult(results: GeocodingResult[], query: string) {
  const populated = results.filter(r => r.population);
  const exact = populated.filter(r => fold(r.name) === fold(query));
  const ranked = (exact.length ? exact : populated)
    .sort((a, b) => (b.population || 0) - (a.population || 0));

  return ranked[0] || results.find(r => fold(r.name) === fold(query)) || results[0] || null;
}

async function ask(query: string, language: string): Promise<GeocodingResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10`
            + `&language=${encodeURIComponent(language)}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const body = await response.json();
    return bestResult(body?.results || [], query);
  } catch {
    return null;
  }
}

async function geocode(name: string, language: string): Promise<Endpoint | null> {
  const key = `${CACHE_PREFIX}${language}.${fold(name)}`;
  try {
    const cached = window.localStorage.getItem(key);
    if (cached) return JSON.parse(cached) as Endpoint;
  } catch {
    // Stockage indisponible : on géocode, sans mémoriser.
  }

  for (const variant of variants(name)) {
    const found = await ask(variant, language);
    if (!found) continue;

    const place: Endpoint = {
      name,
      lat: found.latitude,
      lon: found.longitude,
      country: found.country
    };
    try {
      window.localStorage.setItem(key, JSON.stringify(place));
    } catch {
      // Rien à faire : la carte, elle, sera mise en cache une fois dessinée.
    }
    return place;
  }
  return null;
}

export async function resolvePlace(name: string, cities: City[], language: string) {
  const place = fromTrip(name, cities) ?? (await geocode(name, language));
  if (!place) {
    // Une panne de réseau ressemble ici à un lieu inconnu : le trajet reste
    // affiché sous sa forme simple, sans carte.
    throw new Error(`Lieu introuvable : ${name}`);
  }
  return place;
}
