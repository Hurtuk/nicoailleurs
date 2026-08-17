/** Un trajet de la journée du chapitre, dans l'ordre du déplacement. */
export interface ChapterTravel {
  number: number;
  /** Aller d'un séjour, ou retour. Les deux se dessinent de la même façon. */
  way: 'out' | 'back';
  idStay: number;
  cityFrom?: string;
  cityTo?: string;
  transport?: string;
}

export interface Chapter {
  number: number;
  title: string;
  content: string;
  city?: string;
  citySlug?: string;
  date?: Date;
  nights?: number;
  place?: string;
  stayedUrl?: string;
  /* Les trajets de la journée, vides si elle n'en compte aucun ou si le
     chapitre n'a pas de date. Deux chapitres d'un même jour ont la même liste,
     et la balise [travel n] du contenu désigne celui à afficher. */
  travels: ChapterTravel[];
}
