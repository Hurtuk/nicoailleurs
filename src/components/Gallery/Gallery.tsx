import { useState, useEffect } from "react";
import styles from './Gallery.module.scss';

export default function Gallery({ images = [] as string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  /* Fermeture via Escape */
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: any) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  /* Blocage du scroll quand la popin est ouverte */
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <div className={styles.galleryRoot}>
      {/* Nuage de tuiles */}
      <div className={styles.galleryCloud} role="list" aria-label="Galerie d'images">
        {images.map((src, i) => (
          <div
            key={i}
            className={styles.galleryTile}
            role="listitem"
            tabIndex={0}
            onClick={() => setSelected(src)}
            onKeyDown={(e) => e.key === "Enter" && setSelected(src)}
            aria-label={`Voir ${src} en grand`}
          >
            <img src={src} alt={src} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Popin */}
      {selected && (
        <div
          className={styles.galleryOverlay}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image agrandie"
        >
          <div className={styles.galleryModal}>
            <button
              className={styles.galleryClose}
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img src={selected} alt={selected} />
          </div>
        </div>
      )}
    </div>
  );
}