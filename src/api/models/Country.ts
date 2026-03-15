import type { City } from "./City";
import type { Trip } from "./Trip";

export interface Country {
  num: string;
  codeAlpha2: string;
  name: string;
  slug: string;
  continent: string;
  count?: number;
  trips?: Trip[];
  days?: number;
  cities?: City[];
}