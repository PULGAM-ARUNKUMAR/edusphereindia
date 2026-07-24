import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Loader2 } from "lucide-react";

export function RouteMap({ destination, name }: { destination: string; name: string }) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin(`${pos.coords.latitude},${pos.coords.longitude}`);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Unable to fetch your location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manual.trim();
    if (trimmed.length < 2) return;
    setOrigin(trimmed);
  };

  const embedSrc = origin
    ? `https://www.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&output=embed`
    : null;
  const openHref = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
    : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Find the shortest driving route to <strong className="text-foreground">{name}</strong>.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Button onClick={useMyLocation} disabled={loading} className="sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="mr-2 h-4 w-4" />
          )}
          Use my current location
        </Button>
        <form onSubmit={submitManual} className="flex flex-1 gap-2">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Or enter a city / address"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" variant="secondary">
            Route
          </Button>
        </form>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {embedSrc ? (
        <div className="space-y-3">
          <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
            <iframe
              key={embedSrc}
              title={`Route to ${name}`}
              src={embedSrc}
              className="h-full w-full"
              loading="lazy"
            />
          </div>
          {openHref && (
            <Button asChild variant="outline" size="sm">
              <a href={openHref} target="_blank" rel="noreferrer">
                Open turn-by-turn directions
              </a>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Share your location or enter a starting point to see the shortest route.
        </div>
      )}
    </div>
  );
}