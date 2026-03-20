import type { Country } from "./Country";

export interface Trip {
  id: string;
  title: string;
  place: string;
  excerpt: string;
  startDate: Date;
  endDate: Date;
  slug: string;
  countries: Country[];
}