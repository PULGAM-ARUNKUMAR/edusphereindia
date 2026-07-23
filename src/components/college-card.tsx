import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Home as HomeIcon, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NirfBadge, NaacBadge } from "./nirf-badge";
import { formatINR, type College } from "@/lib/colleges-data";
import { useSavedColleges } from "@/lib/saved-colleges";
import { toast } from "sonner";

export function CollegeCard({ college, view = "grid" }: { college: College; view?: "grid" | "list" }) {
  const { isSaved, toggle } = useSavedColleges();
  const saved = isSaved(college.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(college.id);
    toast.success(saved ? "Removed from saved" : "Saved to your list");
  };

  const layout = view === "list" ? "sm:flex-row" : "flex-col";

  return (
    <div className={`group flex ${layout} overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md`}>
      <Link
        to="/college/$slug"
        params={{ slug: college.slug }}
        className={`relative block overflow-hidden ${view === "list" ? "sm:w-64 shrink-0" : ""}`}
      >
        <img
          src={college.coverImage}
          alt={college.name}
          loading="lazy"
          className="h-48 w-full object-cover transition group-hover:scale-105 sm:h-full"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          <div className="flex flex-wrap gap-1.5">
            <NirfBadge rank={college.nirfRank} />
            <NaacBadge grade={college.naacGrade} />
          </div>
          <button
            onClick={handleSave}
            aria-label="Save college"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition hover:bg-background"
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to="/college/$slug" params={{ slug: college.slug }}>
            <h3 className="text-base font-semibold leading-tight hover:text-primary">
              {college.name}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {college.city}, {college.state}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {college.courses.slice(0, 4).map((c) => (
            <Badge key={c} variant="secondary" className="font-normal">
              {c}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <IndianRupee className="h-3.5 w-3.5" />
            {formatINR(college.feeMin)} – {formatINR(college.feeMax)}/yr
          </span>
          <span className="inline-flex items-center gap-1">
            <HomeIcon className="h-3.5 w-3.5" />
            {college.hostelAvailable ? "Hostel available" : "No hostel"}
          </span>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link to="/college/$slug" params={{ slug: college.slug }}>
              View Details
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={handleSave} aria-label="Save">
            <Bookmark className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}