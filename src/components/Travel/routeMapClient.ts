/*
 *  Ce qu'il faut au navigateur pour fabriquer une carte : le fond de carte, une
 *  règle pour mesurer les textes, et les coordonnées des deux villes.
 */
import type { City } from '../../api/models/City';
import type { Country } from '../../api/models/Country';
import {
  buildRouteMap,
  FONT_HAND,
  FONT_SCRIPT,
  type CountryTopology,
  type MeasureText,
  type RouteMap
} from './routeMap';
import { resolvePlace } from './travelPlaces';

const COUNTRIES_URL = '/data/countries-50m.json';

/* Frontières de Natural Earth au 1:50m (domaine public), livrées avec le site :
   une seule requête par session, et aucune une fois la carte en cache. */
let topology: Promise<CountryTopology> | null = null;

function loadTopology() {
  if (!topology) {
    topology = fetch(COUNTRIES_URL)
      .then(response => {
        if (!response.ok) throw new Error(`Fond de carte indisponible (${response.status}).`);
        return response.json() as Promise<CountryTopology>;
      })
      .catch(error => {
        topology = null;   // un échec réseau ne doit pas condamner la session
        throw error;
      });
  }
  return topology;
}

/*
 *  Mesure des textes par le navigateur, via un canevas hors écran : c'est le seul
 *  moyen de savoir, avant de dessiner, si « Saint-Jacques-de-Compostelle » tient
 *  dans la largeur. Les polices sont demandées d'abord — le canevas ne déclenche
 *  pas leur chargement et mesurerait sinon une police de repli. Le texte est
 *  passé au chargeur car Google Fonts découpe ses polices par plages Unicode :
 *  sans « é », la plage latin-ext n'est pas demandée.
 */
async function textMeasurer(text: string): Promise<MeasureText> {
  const fonts = document.fonts;
  if (fonts?.load) {
    await Promise.all([
      fonts.load(`88px ${FONT_SCRIPT}`, text),
      fonts.load(`46px ${FONT_HAND}`, text)
    ]).catch(() => { /* police indisponible : le repli fera l'affaire */ });
  }

  const context = document.createElement('canvas').getContext('2d');
  if (!context) return (value, _font, size) => value.length * size * 0.5;

  return (value, font, size) => {
    context.font = `${size}px ${font}`;
    return context.measureText(value).width;
  };
}

export type GenerateInput = {
  cityFrom: string;
  cityTo: string;
  transport?: string;
  language: string;
  cities: City[];
  countries: Country[];
};

export async function generateRouteMap(input: GenerateInput): Promise<RouteMap> {
  const [from, to, topojson] = await Promise.all([
    resolvePlace(input.cityFrom, input.cities, input.language),
    resolvePlace(input.cityTo, input.cities, input.language),
    loadTopology()
  ]);

  if (Math.abs(from.lat - to.lat) < 0.02 && Math.abs(from.lon - to.lon) < 0.02) {
    throw new Error('Départ et arrivée au même endroit : rien à tracer.');
  }

  /* Les pays du voyage donnent leur nom traduit à ceux du trajet, par code ISO
     numérique — le même que celui des frontières. */
  const countryNames: Record<string, string> = {};
  for (const country of input.countries) countryNames[country.num] = country.name;

  const written = [from.name, to.name, from.country, to.country, ...Object.values(countryNames)]
    .filter(Boolean)
    .join(' ');

  return buildRouteMap({
    from,
    to,
    transport: input.transport,
    countryNames,
    topology: topojson,
    measure: await textMeasurer(`${written} ${written.toUpperCase()}`)
  });
}
