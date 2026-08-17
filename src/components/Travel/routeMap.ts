/*
 *  Carte d'itinéraire entre deux villes, portée des images du carnet /travel.
 *
 *  Le calcul ne dessine rien : il renvoie un « modèle » — des chemins SVG, des
 *  positions et des textes — que le composant se contente de rendre. Ce modèle
 *  est sérialisable, donc conservable en cache : la carte est calculée à la
 *  première visite, puis relue telle quelle (ni fond de carte à télécharger, ni
 *  géocodage) aux visites suivantes.
 *
 *  Les frontières viennent de `public/data/countries-50m.json`, un TopoJSON de
 *  Natural Earth (1:50m, domaine public) livré avec le site. Le pays d'une ville
 *  est trouvé géométriquement — quel polygone la contient — et jamais par son
 *  nom : son étiquette est ensuite prise dans les pays du voyage, déjà traduits
 *  par l'API, à partir du code ISO numérique commun aux deux sources.
 */
import { geoContains, geoGraticule, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';

/** Version du modèle : la changer invalide les cartes déjà en cache. */
export const ROUTE_MAP_VERSION = 1;

export const SIZE = 1080;          // image carrée, comme celle de /travel
export const BAND = 250;           // hauteur de la bande de texte, en bas
const MARGIN = 72;                 // marge autour du contenu utile
/* Écart minimal entre les deux villes : en dessous, le médaillon du transport
   avale les pastilles et les deux noms se marchent dessus. */
const MIN_SEPARATION = 170;

/* Deux polices déjà chargées par le blog : une anglaise pour les noms de villes
   en grand, une manuscrite pour la carte et la ligne des pays. */
export const FONT_SCRIPT = '"Cookie", cursive';
export const FONT_HAND = '"Caveat", cursive';
const CITY_LABEL_SIZE = 46;
const LEGEND_CITY_SIZE = 88;
const LEGEND_COUNTRY_SIZE = 34;
const LEGEND_MIN_SIZE = 18;
const COUNTRY_SPACING = 0.12;      // interlettrage des pays, en em

export type CountryTopology = Topology<{ countries: GeometryCollection<{ name: string }> }>;

/** Largeur naturelle d'un texte, hors interlettrage (mesurée par le navigateur). */
export type MeasureText = (text: string, font: string, size: number) => number;

export type Endpoint = {
  name: string;
  lon: number;
  lat: number;
  /** Pays renvoyé par le géocodeur, en repli quand le voyage ne le connaît pas. */
  country?: string;
};

export type RouteMapInput = {
  from: Endpoint;
  to: Endpoint;
  /** Fichier de l'icône du transport, tel qu'il est stocké en base. */
  transport?: string;
  /** Nom traduit des pays, par code ISO numérique. */
  countryNames: Record<string, string>;
  topology: CountryTopology;
  measure: MeasureText;
};

export type RouteMapLabel = { text: string; x: number; y: number; anchor: 'start' | 'end' };

/** Une ligne de légende, éventuellement « gauche → droite ». */
export type RouteMapLine = {
  y: number;
  size: number;
  /** Interlettrage en em, 0 pour aucun. */
  spacing: number;
  left: { text: string; x: number };
  right?: { text: string; x: number };
  arrow?: { x: number; y: number; length: number; width: number };
};

export type RouteMap = {
  version: number;
  /** Chemins SVG cumulés : les autres pays, puis les deux pays du trajet. */
  land: string;
  highlight: string;
  graticule: string;
  route: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  labels: RouteMapLabel[];
  logo?: { x: number; y: number; r: number; src: string };
  cities: RouteMapLine;
  countries: RouteMapLine;
};

/* ================= Découpage des géométries ================= */

type CountryFeature = Feature<Polygon | MultiPolygon, { name: string }>;

/** Chaque anneau d'un pays comme polygone autonome : on cadre et on colore le
 *  polygone qui porte la ville, pas le pays entier — la France « entière » de
 *  Natural Earth comprend la Guyane, et son cadre couvrirait la moitié du globe. */
function polygonsOf(country: CountryFeature): Feature<Polygon>[] {
  const rings: Position[][][] = country.geometry.type === 'Polygon'
    ? [country.geometry.coordinates]
    : country.geometry.coordinates;

  return rings.map(coordinates => ({
    type: 'Feature',
    properties: country.properties,
    id: country.id,
    geometry: { type: 'Polygon', coordinates }
  }));
}

/** Distance planaire approchée d'un point aux sommets d'un polygone. */
function roughDistance(polygon: Feature<Polygon>, lon: number, lat: number) {
  const k = Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  for (const ring of polygon.geometry.coordinates) {
    for (const point of ring) {
      const dx = (point[0] - lon) * k;
      const dy = point[1] - lat;
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
  }
  return best;
}

/*
 *  Le polygone qui contient la ville. Le test d'appartenance suffit presque
 *  toujours ; à 1:50m un port ou une ville frontalière peut tomber juste
 *  dehors, d'où le repli sur le polygone le plus proche.
 */
function locate(polygons: Feature<Polygon>[], lon: number, lat: number) {
  let fallback: Feature<Polygon> | null = null;
  let fallbackDistance = Infinity;

  for (const polygon of polygons) {
    if (geoContains(polygon, [lon, lat])) return polygon;
    const d = roughDistance(polygon, lon, lat);
    if (d < fallbackDistance) {
      fallbackDistance = d;
      fallback = polygon;
    }
  }
  return fallback;
}

/* ================= Cadrage ================= */

/** Ramène une longitude dans l'intervalle ]-180, 180]. */
function normalizeLon(lon: number) {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

function fitProjection(from: Endpoint, to: Endpoint, framed: Feature<Polygon>[]) {
  /* La projection tourne pour se centrer sur le trajet : un vol qui franchit le
     180e méridien est alors tracé d'un seul tenant, et c'est le Pacifique — hors
     champ — qui porte la coupure. */
  const lonTo = from.lon + normalizeLon(to.lon - from.lon);
  const projection = geoMercator().rotate([-normalizeLon((from.lon + lonTo) / 2), 0]);

  const target: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      ...framed,
      {
        type: 'Feature',
        properties: {},
        geometry: { type: 'MultiPoint', coordinates: [[from.lon, from.lat], [to.lon, to.lat]] }
      }
    ]
  };

  const height = SIZE - BAND - 2 * MARGIN;
  projection.fitExtent([[MARGIN, MARGIN], [SIZE - MARGIN, MARGIN + height]], target);

  /* Deux villes voisines (Paris - Beauvais) cadrées sur toute la France se
     retrouvent à quelques dizaines de pixels : on resserre alors sur elles,
     quitte à rogner le pays — sa couleur reste visible et son nom est en bas. */
  const a = projection([from.lon, from.lat])!;
  const b = projection([to.lon, to.lat])!;
  const gap = Math.hypot(b[0] - a[0], b[1] - a[1]);

  if (gap > 1 && gap < MIN_SEPARATION) {
    const middle = projection.invert!([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    const [tx, ty] = projection.translate();
    projection.scale((projection.scale() * MIN_SEPARATION) / gap);
    const moved = projection(middle!)!;
    projection.translate([tx + SIZE / 2 - moved[0], ty + MARGIN + height / 2 - moved[1]]);
  }

  return projection;
}

/* ================= Fond de carte ================= */

type Projection = ReturnType<typeof geoMercator>;
type Path = ReturnType<typeof geoPath>;

/*
 *  Allègement du tracé : les sommets qui, à l'écran, tombent à moins d'un pixel
 *  du précédent sont retirés. Le 1:50m aligne des dizaines de points par côte,
 *  invisibles dès qu'un pays entier tient dans l'image ; les garder alourdirait
 *  le cache d'un facteur trois sans rien ajouter au dessin.
 */
function simplify(d: string, tolerance: number) {
  let out = '';
  for (const [, body] of d.matchAll(/M([^MZ]*)Z?/g)) {
    const points: string[] = [];
    let lastX = NaN;
    let lastY = NaN;

    for (const point of body.split('L')) {
      const comma = point.indexOf(',');
      const x = +point.slice(0, comma);
      const y = +point.slice(comma + 1);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (Math.abs(x - lastX) < tolerance && Math.abs(y - lastY) < tolerance) continue;
      points.push(point);
      lastX = x;
      lastY = y;
    }
    // Un polygone réduit à un ou deux points ne couvre plus rien : un îlot du
    // Pacifique sur une carte du monde n'a pas à peser dans le cache.
    if (points.length > 2) out += `M${points.join('L')}Z`;
  }
  return out;
}

/** Les polygones visibles réunis en un seul chemin : un `<path>` par couche. */
function drawPolygons(path: Path, polygons: Feature<Polygon>[], tolerance: number, minSize = 0) {
  let d = '';
  for (const polygon of polygons) {
    const [[x0, y0], [x1, y1]] = path.bounds(polygon);
    if (!Number.isFinite(x0)) continue;
    // Sauter ce qui sort du cadre : sur un trajet européen, la moitié de l'Asie
    // n'a pas à être calculée ni conservée en cache.
    if (x1 < 0 || x0 > SIZE || y1 < 0 || y0 > SIZE) continue;
    if (x1 - x0 < minSize && y1 - y0 < minSize) continue;
    d += path(polygon) ?? '';
  }
  return simplify(d, tolerance);
}

function drawGraticule(projection: Projection, path: Path) {
  // Degrés de longitude visibles : le pas suit le zoom.
  const span = SIZE / ((projection.scale() * Math.PI) / 180);
  const step = span > 90 ? 20 : span > 45 ? 10 : span > 18 ? 5 : span > 7 ? 2 : 1;

  const northWest = projection.invert!([0, 0]);
  const southEast = projection.invert!([SIZE, SIZE]);
  const graticule = geoGraticule().step([step, step]);

  if (northWest && southEast && northWest[0] < southEast[0] && southEast[1] < northWest[1]) {
    graticule.extent([
      [Math.max(-180, northWest[0] - step), Math.max(-85, southEast[1] - step)],
      [Math.min(180, southEast[0] + step), Math.min(85, northWest[1] + step)]
    ]);
  }
  return path(graticule()) ?? '';
}

/* ================= Itinéraire ================= */

/*
 *  Une courbe plutôt qu'un segment : le trait droit fait plan, l'arc évoque le
 *  trajet. Le point de contrôle est décalé perpendiculairement, du côté nord
 *  pour que l'arc ne plonge pas dans la légende.
 */
function routeCurve(a: [number, number], b: [number, number]) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  let nx = -(b[1] - a[1]);
  let ny = b[0] - a[0];
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const control = { x: mx + nx * 0.19, y: my + ny * 0.19 };
  const fixed = (n: number) => n.toFixed(1);
  return {
    d: `M${fixed(a[0])},${fixed(a[1])}Q${fixed(control.x)},${fixed(control.y)} ${fixed(b[0])},${fixed(b[1])}`,
    // Sommet de la quadratique (t = 0,5), là où se pose le logo du transport.
    top: { x: (mx + control.x) / 2, y: (my + control.y) / 2 }
  };
}

type Medallion = { x: number; y: number; r: number };

/** De combien le médaillon empiète sur la boîte du nom, verticalement. */
function overlap(x0: number, x1: number, y: number, logo: Medallion | undefined) {
  if (!logo) return 0;
  const half = CITY_LABEL_SIZE * 0.4;
  const dx = Math.max(x0 - logo.x, logo.x - x1, 0);
  const dy = Math.max(y - half - logo.y, logo.y - y - half, 0);
  if (dx * dx + dy * dy >= logo.r * logo.r) return 0;
  return Math.sqrt(logo.r * logo.r - dx * dx) - dy;
}

/*
 *  Nom de ville posé du côté qui s'éloigne de l'autre ville : sur un trajet
 *  horizontal, deux noms tournés vers l'intérieur se rejoignent au milieu, là où
 *  se trouve justement le médaillon. On ne repasse de l'autre côté que si le nom
 *  sortirait de l'image, et s'il tombe alors sur le médaillon on le relève juste
 *  assez pour le dégager.
 */
function cityLabel(
  text: string,
  point: [number, number],
  other: [number, number],
  logo: Medallion | undefined,
  measure: MeasureText
): RouteMapLabel {
  const width = measure(text, FONT_HAND, CITY_LABEL_SIZE);
  const y = Math.max(40, Math.min(point[1], SIZE - BAND - 16));

  const away = point[0] >= other[0];
  const sides = [away, !away].map(right => ({
    x: right ? point[0] + 28 : point[0] - 28,
    anchor: (right ? 'start' : 'end') as 'start' | 'end',
    x0: right ? point[0] + 28 : point[0] - 28 - width,
    x1: right ? point[0] + 28 + width : point[0] - 28
  }));

  const side = sides.find(s => s.x0 >= 24 && s.x1 <= SIZE - 24) ?? sides[0];
  const intruding = overlap(side.x0, side.x1, y, logo);
  // Vers le haut si le nom est déjà au-dessus du médaillon, vers le bas sinon.
  const lift = logo && y < logo.y ? -intruding : intruding;

  return {
    text,
    x: side.x,
    y: Math.max(40, Math.min(y + lift, SIZE - BAND - 16)),
    anchor: side.anchor
  };
}

/*
 *  « Gauche → Droite » centré, la flèche tracée entre les deux — aucune de nos
 *  polices n'a le caractère « → ». La taille baisse jusqu'à ce que l'ensemble
 *  tienne dans la largeur : « Saint-Jacques-de-Compostelle » ne doit pas
 *  déborder. Avec un seul terme (deux villes du même pays), pas de flèche.
 */
function layoutLine(
  left: string,
  right: string | undefined,
  options: { y: number; size: number; font: string; spacing: number; measure: MeasureText }
): RouteMapLine {
  const available = SIZE - 96;
  let size = options.size;
  let gap = 0;
  let arrow = 0;
  let total = 0;

  const width = (text: string, at: number) =>
    options.measure(text, options.font, at) + options.spacing * at * text.length;

  for (;;) {
    gap = right ? size * 0.34 : 0;
    arrow = right ? size * 0.78 : 0;
    total = width(left, size) + (right ? width(right, size) : 0) + arrow + gap * 2;
    if (total <= available || size <= LEGEND_MIN_SIZE) break;
    size -= 2;
  }

  const start = (SIZE - total) / 2;
  const line: RouteMapLine = {
    y: options.y,
    size,
    spacing: options.spacing,
    left: { text: left, x: start }
  };

  if (right) {
    const after = start + width(left, size) + gap;
    line.arrow = { x: after, y: options.y - size * 0.28, length: arrow, width: size * 0.045 };
    line.right = { text: right, x: after + arrow + gap };
  }
  return line;
}

/* ================= Composition ================= */

/*
 *  Le dixième de pixel suffit pour une image de 1080 : arrondir avant la mise en
 *  cache évite d'y stocker seize décimales par coordonnée.
 */
function round<T>(value: T): T {
  if (typeof value === 'number') return (Math.round(value * 10) / 10) as T;
  if (Array.isArray(value)) return value.map(round) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, round(v)])) as T;
  }
  return value;
}

/** Le médaillon se réduit sur un trajet court, sinon il avale les pastilles. */
function logoRadius(a: [number, number], b: [number, number]) {
  return Math.max(34, Math.min(62, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.16));
}

export function buildRouteMap(input: RouteMapInput): RouteMap {
  const { from, to, measure } = input;
  const countries = feature(input.topology, input.topology.objects.countries)
    .features as CountryFeature[];
  const polygons = countries.flatMap(polygonsOf);

  const fromPolygon = locate(polygons, from.lon, from.lat);
  const toPolygon = locate(polygons, to.lon, to.lat);
  const framed = [fromPolygon, toPolygon].filter((p, i, all): p is Feature<Polygon> =>
    !!p && all.indexOf(p) === i);

  const projection = fitProjection(from, to, framed);
  const path = geoPath(projection).digits(1);

  const a = projection([from.lon, from.lat])!;
  const b = projection([to.lon, to.lat])!;
  const route = routeCurve(a, b);
  const logo = input.transport
    ? { ...route.top, r: logoRadius(a, b), src: `/images/transports/${input.transport}` }
    : undefined;

  /* Un nom par pays concerné, dans l'ordre du trajet, pris chez le voyage
     (donc traduit) plutôt que chez Natural Earth (anglais). */
  const names: string[] = [];
  for (const [polygon, endpoint] of [[fromPolygon, from], [toPolygon, to]] as const) {
    const code = polygon?.id ? String(polygon.id) : '';
    const name = input.countryNames[code] || endpoint.country || polygon?.properties?.name || '';
    const upper = name.toUpperCase();
    if (upper && !names.includes(upper)) names.push(upper);
  }

  return round({
    version: ROUTE_MAP_VERSION,
    land: drawPolygons(path, polygons.filter(p => !framed.includes(p)), 1, 2),
    // Les deux pays du trajet sont le sujet de l'image : tracés plus fin.
    highlight: drawPolygons(path, framed, 0.5),
    graticule: drawGraticule(projection, path),
    route: route.d,
    from: { x: a[0], y: a[1] },
    to: { x: b[0], y: b[1] },
    labels: [cityLabel(from.name, a, b, logo, measure), cityLabel(to.name, b, a, logo, measure)],
    logo,
    cities: layoutLine(from.name, to.name, {
      y: SIZE - 116, size: LEGEND_CITY_SIZE, font: FONT_SCRIPT, spacing: 0, measure
    }),
    countries: layoutLine(names[0] ?? '', names[1], {
      y: SIZE - 48, size: LEGEND_COUNTRY_SIZE, font: FONT_HAND, spacing: COUNTRY_SPACING, measure
    })
  });
}
