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