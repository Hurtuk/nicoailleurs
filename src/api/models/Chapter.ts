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
  cityFrom?: string;
  cityTo?: string;
  transport?: string;
}