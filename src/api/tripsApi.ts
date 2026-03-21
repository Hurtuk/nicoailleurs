import axios from "axios";
import type { Trip } from "./models/Trip";
import type { Country } from "./models/Country";
import type { City } from "./models/City";

const API_BASE = "https://nicoailleurs.com/api";

export const getTrips = async (lang: string, filters?: any): Promise<Trip[]> => {
  const { data } = await axios.get<Trip[]>(`${API_BASE}/getTrips.php?lang=${lang}&` + jsonToUrl(filters));
  return data.map(trip => ({
    ...trip,
    startDate: new Date(trip.startDate),
    endDate: new Date(trip.endDate),
  }));
};

export const getTrip = async (slug: string, lang: string): Promise<Trip> => {
  const { data } = await axios.get<Trip>(`${API_BASE}/getTrip.php?trip=${slug}&lang=${lang}`);
  return {
    ...data,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
  };
};

export const getVisitedCountries = async (lang: string): Promise<Country[]> => {
  const { data } = await axios.get<Country[]>(`${API_BASE}/getVisitedCountries.php/?lang=${lang}`);
  return data.map(d => ({
    ...d,
    count: d.count ? parseInt('' + d.count) : undefined,
    days: d.days ? parseInt('' + d.days) : undefined
  }));
};

export const getVisitedCities = async (lang: string, all: boolean): Promise<City[]> => {
  const { data } = await axios.get<City[]>(`${API_BASE}/getVisitedCities.php/?lang=${lang}${all ? "&all" : ""}`);
  return data.map(d => ({
    ...d,
    count: d.count ? parseInt('' + d.count) : undefined
  }));
};

export const getCountry = async (lang: string, slug: string): Promise<Country> => {
  const { data } = await axios.get<Country>(`${API_BASE}/getCountry.php/?lang=${lang}&country=${slug}`);
  return {
    ...data,
    trips: data.trips?.map(t => ({ ...t, startDate: new Date(t.startDate)})),
    count: data.count ? parseInt('' + data.count) : undefined,
    days: data.days ? parseInt('' + data.days) : undefined
  };
};

export const getCity = async (lang: string, slug: string): Promise<City> => {
  const { data } = await axios.get<City>(`${API_BASE}/getCity.php/?lang=${lang}&city=${slug}`);
  return {
    ...data,
    trips: data.trips?.map(t => ({ ...t, startDate: new Date(t.startDate)})),
    count: data.count ? parseInt('' + data.count) : undefined
  };
};

function jsonToUrl(json: any) {
  return new URLSearchParams(json).toString();
}