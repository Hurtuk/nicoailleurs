/*
 *  Cache des cartes d'itinéraire, dans le stockage local du visiteur.
 *
 *  Une carte est calculée à la première visite du chapitre, puis relue telle
 *  quelle : plus de fond de carte à télécharger, plus de géocodage, plus de
 *  projection à calculer. Les modèles pèsent quelques dizaines de kilo-octets,
 *  d'où le nombre d'entrées volontairement bas et l'éviction des plus anciennes
 *  dès que le navigateur se plaint.
 */
import { ROUTE_MAP_VERSION, type RouteMap } from './routeMap';

const PREFIX = 'nicoailleurs.routeMap.';
const INDEX = `${PREFIX}index`;
const MAX_ENTRIES = 8;

/** Clé d'une carte : même trajet, mais une carte par langue (villes et pays). */
export function routeMapKey(language: string, from: string, to: string, transport = '') {
  return `${PREFIX}${ROUTE_MAP_VERSION}.${language}.${from}>${to}.${transport}`;
}

/* Navigation privée, stockage saturé ou désactivé : le cache est un confort, son
   absence ne doit jamais empêcher l'affichage. */
function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readIndex(store: Storage): string[] {
  try {
    const parsed = JSON.parse(store.getItem(INDEX) || '[]');
    return Array.isArray(parsed) ? parsed.filter(key => typeof key === 'string') : [];
  } catch {
    return [];
  }
}

export function readRouteMap(key: string): RouteMap | null {
  const store = storage();
  if (!store) return null;

  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    const map = JSON.parse(raw) as RouteMap;
    // Une carte d'une version antérieure du modèle ne se dessine plus.
    return map.version === ROUTE_MAP_VERSION ? map : null;
  } catch {
    return null;
  }
}

export function writeRouteMap(key: string, map: RouteMap) {
  const store = storage();
  if (!store) return;

  // La plus récemment écrite en tête : c'est la fin de la liste qu'on sacrifie.
  const index = [key, ...readIndex(store).filter(entry => entry !== key)];
  const evicted = index.splice(MAX_ENTRIES);
  for (const key of evicted) store.removeItem(key);

  const value = JSON.stringify(map);
  for (;;) {
    try {
      store.setItem(key, value);
      store.setItem(INDEX, JSON.stringify(index));
      return;
    } catch {
      // Quota atteint : on libère la plus ancienne carte et on réessaie. Sans
      // rien à libérer, la carte restera simplement à recalculer.
      const oldest = index.pop();
      if (!oldest || oldest === key) return;
      store.removeItem(oldest);
    }
  }
}
