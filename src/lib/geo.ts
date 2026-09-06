import { colleges, type College } from "./colleges-data";

/** Approximate campus coordinates (lat, lng) keyed by college slug. */
export const COLLEGE_COORDS: Record<string, { lat: number; lng: number }> = {
  "iit-bombay": { lat: 19.1334, lng: 72.9133 },
  "iim-ahmedabad": { lat: 23.0333, lng: 72.53 },
  "aiims-new-delhi": { lat: 28.5672, lng: 77.21 },
  "st-xaviers-mumbai": { lat: 18.944, lng: 72.832 },
  "christ-university": { lat: 12.9345, lng: 77.606 },
  "vit-vellore": { lat: 12.9692, lng: 79.1559 },
};

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export type NearbyCollege = College & { distanceKm: number };

export function collegesNearby(
  origin: { lat: number; lng: number },
  limit = 6,
): NearbyCollege[] {
  return colleges
    .filter((c) => COLLEGE_COORDS[c.slug])
    .map((c) => ({ ...c, distanceKm: haversineKm(origin, COLLEGE_COORDS[c.slug]!) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function formatKm(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}
