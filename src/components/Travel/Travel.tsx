/*
 *  La balise [travel] d'un chapitre : une carte de l'itinéraire entre les deux
 *  villes, dessinée par le navigateur à la première visite puis relue depuis le
 *  cache. Le temps qu'elle se calcule — et si elle ne peut pas l'être — le
 *  trajet reste affiché sous sa forme simple : ville, transport, ville.
 */
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Travel.module.scss';
import type { City } from '../../api/models/City';
import type { Country } from '../../api/models/Country';
import { BAND, SIZE, type RouteMap, type RouteMapLine } from './routeMap';
import { generateRouteMap } from './routeMapClient';
import { readRouteMap, routeMapKey, writeRouteMap } from './routeMapStore';

type Props = {
  cityFrom: string;
  cityTo: string;
  transport: string;
  cities: City[];
  countries: Country[];
};

/** L'état d'une carte : sa clé, la carte si on l'a, et l'échec s'il y en a eu. */
function load(key: string) {
  return { key, map: readRouteMap(key), failed: false };
}

export default function Travel({ cityFrom, cityTo, transport, cities, countries }: Props) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const key = routeMapKey(language, cityFrom, cityTo, transport);

  const [state, setState] = useState(() => load(key));
  /* Chapitre suivant ou langue changée : on repart aussitôt de la carte en cache
     pour cette clé, l'ajustement pendant le rendu évitant l'affichage d'une
     carte qui n'est plus celle du trajet. */
  if (state.key !== key) setState(load(key));
  const { map, failed } = state;

  /* Les villes et pays du voyage servent au calcul mais ne le déclenchent pas :
     une nouvelle instance du même voyage ne doit pas redessiner la carte. */
  const trip = useRef({ cities, countries });
  useEffect(() => {
    trip.current = { cities, countries };
  }, [cities, countries]);

  useEffect(() => {
    if (map || failed) return;

    let current = true;

    /* Petit délai avant de dessiner : au changement de langue, la langue bascule
       un rendu avant que le voyage traduit n'arrive, et une carte « Séoul » sous
       drapeau anglais serait calculée pour rien. */
    const settle = window.setTimeout(() => {
      generateRouteMap({ cityFrom, cityTo, transport, language, ...trip.current })
        .then(built => {
          writeRouteMap(key, built);
          if (current) setState({ key, map: built, failed: false });
        })
        .catch(() => {
          if (current) setState({ key, map: null, failed: true });
        });
    }, 250);

    return () => {
      current = false;
      window.clearTimeout(settle);
    };
  }, [key, map, failed, cityFrom, cityTo, transport, language]);

  if (map) {
    // « Itinéraire d'Istanbul », pas « de Istanbul » : l'infobulle du SVG se lit.
    const elided = /^[aeiouyàâäéèêëîïôöûüh]/i.test(cityFrom);
    const label = t(elided ? 'travel.route_elided' : 'travel.route', { from: cityFrom, to: cityTo });
    return <RouteMapFigure map={map} label={label} />;
  }
  return <TravelSummary cityFrom={cityFrom} cityTo={cityTo} transport={transport} pending={!failed} />;
}

/* ================= Le trajet en une ligne ================= */

function TravelSummary({ cityFrom, cityTo, transport, pending }: Omit<Props, 'cities' | 'countries'> & { pending: boolean }) {
  return (
    <div className={pending ? styles.pending : undefined}>
      <div className={styles.travelWrapper}>
        <div>{cityFrom}</div>
        <div>
          <img src={'/images/transports/' + transport} alt="" />
        </div>
        <div>{cityTo}</div>
      </div>
    </div>
  );
}

/* ================= La carte ================= */

/*
 *  Toutes les icônes de transport regardent vers l'est : sur un trajet qui va
 *  vers l'ouest, celle du médaillon avancerait à reculons. On la retourne.
 *
 *  Le sens se lit sur les abscisses projetées, non sur les longitudes : la
 *  projection pivote pour se centrer sur le trajet, si bien qu'un vol qui
 *  franchit le 180e méridien — Tokyo vers Los Angeles, longitudes 139 puis -118
 *  — reste tracé de gauche à droite, et l'avion doit bien regarder à droite.
 */
function westward(map: RouteMap) {
  return map.to.x < map.from.x;
}

/** Symétrie horizontale autour de l'axe x = cx, l'image restant en place. */
function mirror(cx: number) {
  return `translate(${2 * cx} 0) scale(-1 1)`;
}

function RouteMapFigure({ map, label }: { map: RouteMap; label: string }) {
  // Les deux-points de useId n'ont rien à faire dans un url(#…).
  const id = useId().replace(/:/g, '');
  const paper = `${id}-paper`;
  const shadow = `${id}-shadow`;

  return (
    <svg
      className={styles.map}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{label}</title>
      <defs>
        <linearGradient id={paper} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.paperClear} />
          <stop offset="1" className={styles.paperSolid} />
        </linearGradient>
        <filter id={shadow} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="9" floodColor="#282d32" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect className={styles.sea} width={SIZE} height={SIZE} />
      <path className={styles.land} d={map.land} />
      <path className={styles.highlight} d={map.highlight} />
      <path className={styles.graticule} d={map.graticule} />

      <path className={styles.routeHalo} d={map.route} />
      <path className={styles.route} d={map.route} />

      {[map.from, map.to].map((point, i) => (
        <g key={i}>
          <circle className={styles.pin} cx={point.x} cy={point.y} r={15} />
          <circle className={styles.pinCore} cx={point.x} cy={point.y} r={5.5} />
        </g>
      ))}

      {map.labels.map((city, i) => (
        <text
          key={i}
          className={styles.cityLabel}
          x={city.x}
          y={city.y}
          textAnchor={city.anchor}
          dominantBaseline="middle"
        >
          {city.text}
        </text>
      ))}

      {map.logo && (
        <g>
          <circle
            className={styles.medallion}
            cx={map.logo.x}
            cy={map.logo.y}
            r={map.logo.r}
            filter={`url(#${shadow})`}
          />
          <image
            href={map.logo.src}
            x={map.logo.x - map.logo.r * 0.64}
            y={map.logo.y - map.logo.r * 0.64}
            width={map.logo.r * 1.28}
            height={map.logo.r * 1.28}
            preserveAspectRatio="xMidYMid meet"
            transform={westward(map) ? mirror(map.logo.x) : undefined}
          />
        </g>
      )}

      {/* La bande du bas porte tout le texte : un nom posé sur un pays étroit
          finirait toujours par passer sous une pastille ou sous le médaillon. */}
      <rect fill={`url(#${paper})`} y={SIZE - BAND - 80} width={SIZE} height={120} />
      <rect className={styles.paper} y={SIZE - BAND + 39} width={SIZE} height={BAND} />
      <LegendLine line={map.cities} className={styles.legendCities} />
      <LegendLine line={map.countries} className={styles.legendCountries} />
    </svg>
  );
}

/** Petite flèche tracée à la main : aucune de nos deux polices n'a « → ». */
function arrowPath({ x, y, length, width }: NonNullable<RouteMapLine['arrow']>) {
  const tip = x + length;
  const back = tip - width * 2.6;
  return `M${x},${y}H${tip}M${back},${y - width * 2.2}L${tip},${y}L${back},${y + width * 2.2}`;
}

/** La ligne porte la police et la couleur ; textes et flèche s'y accordent. */
function LegendLine({ line, className }: { line: RouteMapLine; className: string }) {
  const spacing = line.spacing ? `${line.spacing}em` : undefined;

  return (
    <g className={className}>
      <text className={styles.legendText} x={line.left.x} y={line.y} fontSize={line.size} letterSpacing={spacing}>
        {line.left.text}
      </text>
      {line.right && (
        <text className={styles.legendText} x={line.right.x} y={line.y} fontSize={line.size} letterSpacing={spacing}>
          {line.right.text}
        </text>
      )}
      {line.arrow && (
        <path className={styles.legendArrow} d={arrowPath(line.arrow)} strokeWidth={line.arrow.width} />
      )}
    </g>
  );
}
