import Gallery from "../components/Gallery/Gallery";
import Hike from "../components/Hike/Hike";
import Travel from "../components/Travel/Travel";
import { CDN } from "./buildLocalizedUrl";

export function grammarRules(language: string, paragraph: string) {
  if (language === 'fr') {
    paragraph = paragraph.replace(/"([^"]+)"/g, "«\u00A0$1\u00A0»");
  }

  paragraph = paragraph.replace(/ ([:?!;»])/g, "\u00A0$1");
  paragraph = paragraph.replace(/« /g, "«\u00A0");

  paragraph = paragraph.replaceAll("...", "…");
  return paragraph;
}

export function formatContent(language: string, tripId: string, content: string, cityFrom: string | undefined, cityTo: string | undefined, transport: string | undefined) {
  return content
    .split(/\n+/)
    .filter(Boolean)
    .map((paragraph, i) => {
      // Ligne [gallery fichier1.jpg fichier2.jpg ...]
      const normalized = paragraph.replace(/\u00A0/g, ' ').trim();

      let content = gallery(normalized, i, tripId);
      if (content !== null) return content;

      content = travel(normalized, i, cityFrom, cityTo, transport);
      if (content !== null) return content;

      content = hike(normalized, i, tripId);
      if (content !== null) return content;

      paragraph = grammarRules(language, paragraph);

      // Paragraphe texte classique avec éventuels [img ...]
      return <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />;
    });
}

type GuideItem = { text: string; children: string[] };
type GuideList = { type: 'ul' | 'ol'; items: GuideItem[] };

// Formatage inline appliqué au contenu des paragraphes, titres et items de liste :
//   *gras*      → <strong>  (au sein d'une ligne ; les titres — ligne entière entre *…* — sont gérés en amont)
//   _italique_  → <em>      (ligne entière ou au sein d'un paragraphe)
function inlineMarkup(language: string, text: string): string {
  return grammarRules(language, text)
    .replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>');
}

// Formatage du contenu d'un guide :
//   *Titre*                  → <h2>
//   [gallery a.jpg b.jpg]    → galerie d'images (photos/guides/{idGuide}/…)
//   - item                   → liste non ordonnée (<ul>)
//     - sous-item            → sous-liste (une espace avant le tiret)
//   x. item                  → liste ordonnée (<ol>)
//   (autre)                  → <p>
export function formatGuideContent(language: string, content: string, guideId: string) {
  const nodes: JSX.Element[] = [];
  // État encapsulé dans un objet pour éviter le narrowing de flow sur une variable réassignée dans des closures
  const state: { list: GuideList | null; key: number } = { list: null, key: 0 };

  const inline = (text: string) => ({ __html: inlineMarkup(language, text) });

  const renderItem = (item: GuideItem, i: number) => (
    <li key={i}>
      <span dangerouslySetInnerHTML={inline(item.text)} />
      {item.children.length > 0 && (
        <ul>
          {item.children.map((child, j) => (
            <li key={j} dangerouslySetInnerHTML={inline(child)} />
          ))}
        </ul>
      )}
    </li>
  );

  const flush = () => {
    if (!state.list) return;
    const items = state.list.items.map(renderItem);
    nodes.push(state.list.type === 'ol' ? <ol key={state.key++}>{items}</ol> : <ul key={state.key++}>{items}</ul>);
    state.list = null;
  };

  const openList = (type: 'ul' | 'ol'): GuideList => {
    if (!state.list || state.list.type !== type) {
      flush();
      state.list = { type, items: [] };
    }
    return state.list;
  };

  for (const raw of content.split(/\r?\n/)) {
    const line = raw.replace(/ /g, ' ').replace(/\s+$/, '');
    const trimmed = line.trim();

    if (trimmed === '') { flush(); continue; }

    // Titre : ligne entière entourée d'une seule paire d'astérisques (aucun astérisque interne,
    // sinon c'est un paragraphe contenant plusieurs segments en gras)
    const titleMatch = trimmed.match(/^\*([^*]+)\*$/);
    if (titleMatch) {
      flush();
      nodes.push(<h2 key={state.key++} dangerouslySetInnerHTML={inline(titleMatch[1].trim())} />);
      continue;
    }

    // Galerie d'images : [gallery fichier1.jpg fichier2.jpg ...]
    const galleryMatch = trimmed.match(/^\[gallery ([^\]]+)\]$/);
    if (galleryMatch) {
      flush();
      nodes.push(galleryElement(galleryMatch[1], state.key++, `${CDN}/photos/guides/${guideId}`));
      continue;
    }

    // Sous-item (indenté d'au moins une espace, commence par un tiret)
    const subMatch = line.match(/^\s+-\s+(.*)$/);
    if (subMatch && state.list && state.list.items.length) {
      state.list.items[state.list.items.length - 1].children.push(subMatch[1].trim());
      continue;
    }

    // Item de liste ordonnée : "x. ..."
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      openList('ol').items.push({ text: orderedMatch[1].trim(), children: [] });
      continue;
    }

    // Item de liste non ordonnée : "- ..."
    const bulletMatch = trimmed.match(/^-\s+(.*)$/);
    if (bulletMatch) {
      openList('ul').items.push({ text: bulletMatch[1].trim(), children: [] });
      continue;
    }

    // Paragraphe classique
    flush();
    nodes.push(<p key={state.key++} dangerouslySetInnerHTML={inline(trimmed)} />);
  }

  flush();
  return nodes;
}

// Construit une galerie (ou une vidéo) à partir d'une liste de fichiers et d'un chemin de base
function galleryElement(filenames: string, key: number, basePath: string) {
  const images = filenames
    .split(/\s+/)
    .filter(Boolean)
    .sort((img1, img2) => img1.localeCompare(img2))
    .map(filename => `${basePath}/${filename}`);
  if (images[0].endsWith("mp4") || images[0].endsWith("3gp")) {
    return <video key={key} controls style={{display: 'block', maxHeight: '400px', margin: '0 auto'}}>
      <source src={images[0]} type="video/mp4" />
    </video>;
  }
  return <Gallery key={key} images={images} />;
}

function gallery(normalized: string, i:number, tripId: string) {
  const galleryMatch = normalized.match(/^\[gallery ([^\]]+)\]$/);
  if (galleryMatch) {
    return galleryElement(galleryMatch[1], i, `${CDN}/photos/${tripId}`);
  }
  return null;
}

function travel(normalized: string, i: number, cityFrom: string | undefined, cityTo: string | undefined, transport: string | undefined) {
  const travelMatch = normalized.match(/\[travel\]/);
  if (travelMatch && cityFrom && cityTo && transport) {
    return <Travel key={i} cityFrom={cityFrom} cityTo={cityTo} transport={transport} />
  }
  return null;
}

function hike(normalized: string, i: number, idTrip: string) {
  const hikeMatch = normalized.match(/\[hike ([^\]]+) (\d+(?:[.,]\d+)?) (\d+) (.*)\]/);
  if (hikeMatch) {
    return <Hike key={i} title={hikeMatch[1]} distance={parseFloat(hikeMatch[2])} height={parseInt(hikeMatch[3])} url={hikeMatch[4]} idTrip={idTrip} />
  }
  return null;
}