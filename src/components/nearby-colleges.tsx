import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Navigation, Loader2, MapPin, Radio, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collegesNearby, formatKm, type NearbyCollege } from "@/lib/geo";

export function NearbyColleges({ limit = 6 }: { limit?: number }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const stop = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setTracking(false);
  };

  useEffect(() => () => stop(), []);

  const start = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Live location is not supported on this device.");
      return;
    }
    setError(null);
    setLoading(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAccuracy(pos.coords.accuracy);
        setUpdatedAt(new Date());
        setLoading(false);
        setTracking(true);
      },
      (err) => {
        setError(err.message || "Unable to read your location.");
        setLoading(false);
        stop();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
  };

  const nearby: NearbyCollege[] = coords ? collegesNearby(coords, limit) : [];

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <MapPin className="h-5 w-5 text-primary" />
            Colleges near you
          </h2>
          <p className="text-sm text-muted-foreground">
            Live GPS tracking sorts campuses by real distance from you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tracking && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              Live
            </span>
          )}
          <Button onClick={tracking ? stop : start} disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="mr-2 h-4 w-4" />
            )}
            {tracking ? "Stop tracking" : "Use my location"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {coords && (
        <p className="mt-3 text-xs text-muted-foreground">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          {accuracy ? ` · ±${Math.round(accuracy)} m` : ""}
          {updatedAt ? ` · updated ${updatedAt.toLocaleTimeString()}` : ""}
        </p>
      )}

      {nearby.length > 0 ? (
        <ul className="mt-4 divide-y rounded-xl border">
          {nearby.map((c) => (
            <li key={c.id}>
              <Link
                to="/college/$slug"
                params={{ slug: c.slug }}
                className="flex items-center gap-3 p-3 hover:bg-muted/60"
              >
                <img
                  src={c.coverImage}
                  alt={`${c.name} campus`}
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.city}, {c.state} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> NIRF #{c.nirfRank}
                    </span>
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {formatKm(c.distanceKm)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Turn on your location to see the closest campuses and live distances.
          </div>
        )
      )}
    </div>
  );
}
