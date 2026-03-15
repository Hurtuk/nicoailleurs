export interface City {
  id: string;
  slug: string;
  name: string;
  latitude: string;
  longitude: string;
  hideOnMap: boolean;
  count?: number;
  days?: number;
}