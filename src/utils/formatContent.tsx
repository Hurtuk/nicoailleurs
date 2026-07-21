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

// Formatage du contenu d'un guide :
//   *Titre*        → <h2>
//   - item         → liste non ordonnée (<ul>)
//     - sous-item  → sous-liste (une espace avant le tiret)
//   x. item        → liste ordonnée (<ol>)
//   (autre)        → <p>
export function formatGuideContent(language: string, content: string) {
  const nodes: JSX.Element[] = [];
  // État encapsulé dans un objet pour éviter le narrowing de flow sur une variable réassignée dans des closures
  const state: { list: GuideList | null; key: number } = { list: null, key: 0 };

  const inline = (text: string) => ({ __html: grammarRules(language, text) });

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

    // Titre entre astérisques
    const titleMatch = trimmed.match(/^\*(.+)\*$/);
    if (titleMatch) {
      flush();
      nodes.push(<h2 key={state.key++} dangerouslySetInnerHTML={inline(titleMatch[1].trim())} />);
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

function gallery(normalized: string, i:number, tripId: string) {
  const galleryMatch = normalized.match(/^\[gallery ([^\]]+)\]$/);
  if (galleryMatch) {
    const images = galleryMatch[1]
      .split(/\s+/)
      .filter(Boolean)
      .sort((img1, img2) => img1.localeCompare(img2))
      .map(filename => `${CDN}/photos/${tripId}/${filename}`);
    if (images[0].endsWith("mp4") || images[0].endsWith("3gp")) {
      return <video controls style={{display: 'block', maxHeight: '400px', margin: '0 auto'}}>
        <source src={images[0]} type="video/mp4" />
      </video>;
    }
    return <Gallery key={i} images={images} />;
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