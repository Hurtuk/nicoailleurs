import Gallery from "../components/Gallery/Gallery";
import Travel from "../components/Travel/Travel";
import { ROOT } from "./buildLocalizedUrl";

export function formatContent(tripId: string, content: string, cityFrom: string | undefined, cityTo: string | undefined, transport: string | undefined) {
  return content
    .split(/\n+/)
    .filter(Boolean)
    .map((paragraph, i) => {
      // Ligne [gallery fichier1.jpg fichier2.jpg ...]
      const normalized = paragraph.replace(/\u00A0/g, ' ').trim();
      const galleryMatch = normalized.match(/^\[gallery ([^\]]+)\]$/);
      if (galleryMatch) {
        const images = galleryMatch[1]
          .split(/\s+/)
          .filter(Boolean)
          .map(filename => `${ROOT}/photos/${tripId}/${filename}`);
        if (images[0].endsWith("mp4") || images[0].endsWith("3gp")) {
          return <video controls style={{display: 'block', maxHeight: '400px', margin: '0 auto'}}>
            <source src={images[0]} type="video/mp4" />
          </video>;
        } else {
          return <Gallery key={i} images={images} />;
        }
      } else {
        const travelMatch = normalized.match(/\[travel\]/);
        if (travelMatch && cityFrom && cityTo && transport) {
          return <Travel key={i} cityFrom={cityFrom} cityTo={cityTo} transport={transport} />
        } else {
          paragraph = paragraph.replace(/ ([:?!;])/g, "\u00A0$1");
        }
      }

      // Paragraphe texte classique avec éventuels [img ...]
      return <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />;
    });
}