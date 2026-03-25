import Gallery from "../components/Gallery/Gallery";
import { ROOT } from "./buildLocalizedUrl";

export function formatContent(tripId: string, content: string) {
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
        return <Gallery key={i} images={images} />;
      }

      // Paragraphe texte classique avec éventuels [img ...]
      const html = paragraph.replace(
        /\[img ([^\]]+)\]/g,
        (_, filename) => `<img src="${ROOT}/photos/${tripId}/${filename}" />`
      );
      return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
}