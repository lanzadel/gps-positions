import { GpsPosition } from "./types";

const KEY = "gps_positions_v1";

const seed: GpsPosition[] = [
  {
    id: "paris",
    name: "Paris",
    lat: 48.8566,
    lng: 2.3522,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "casablanca",
    name: "Casablanca",
    lat: 33.5731,
    lng: -7.5898,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function loadPositions(): GpsPosition[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw) as GpsPosition[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePositions(items: GpsPosition[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}