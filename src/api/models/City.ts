import type { Country } from "./Country";
import type { Trip } from "./Trip";

export interface City {
  id: string;
  slug: string;
  name: string;
  latitude: string;
  longitude: string;
  hideOnMap: boolean;
  count?: number;
  country?: Country;
  trips?: Trip[];
  cover?: string;
}