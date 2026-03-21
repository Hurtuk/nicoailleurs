import type { Budget } from "./Budget";
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
  days: number;
  people: number;
  budgets: Budget[];
}