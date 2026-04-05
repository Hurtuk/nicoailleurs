import type { Budget } from "./Budget";
import type { Chapter } from "./Chapter";
import type { City } from "./City";
import type { Country } from "./Country";
import type { Tag } from "./Tag";

export interface Trip {
  id: string;
  title: string;
  place: string;
  excerpt: string;
  startDate: Date;
  endDate: Date;
  slug: string;
  countries: Country[];
  days: number;
  people: number;
  budgets: Budget[];
  chapters: Chapter[];
  cities: City[];
  album?: string;
  tags: Tag[];
}