export interface City {
  id: string;
  path: string;
  name: string;
  latitude: number;
  longitude: number;
  hideOnMap: boolean;
  count?: number;
}