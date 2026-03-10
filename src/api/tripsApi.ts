import axios from "axios";
import type { Trip } from "./models/Trip";
import type { Country } from "./models/Country";
import type { City } from "./models/City";

const API_BASE = "https://nicoailleurs.com/api";

export const getTrips = async (lang: string, filters?: any): Promise<Trip[]> => {
  const { data } = await axios.get<Trip[]>(`${API_BASE}/getTrips.php?lang=${lang}&` + jsonToUrl(filters));
  return data;
};

export const getTrip = async (id: string | number, lang: string): Promise<Trip> => {
  const { data } = await axios.get<Trip>(`${API_BASE}/getTrip.php?id=${id}&lang=${lang}`);
  return data;
};

export const getVisitedCountries = async (lang: string): Promise<Country[]> => {
  const { data } = await axios.get<Country[]>(`${API_BASE}/getVisitedCountries.php/?lang=${lang}`);
  return data;
};

export const getVisitedCities = async (lang: string): Promise<City[]> => {
  const { data } = await axios.get<City[]>(`${API_BASE}/getVisitedCities.php/?lang=${lang}`);
  return data;
};

function jsonToUrl(json: any) {
  return new URLSearchParams(json).toString();
}