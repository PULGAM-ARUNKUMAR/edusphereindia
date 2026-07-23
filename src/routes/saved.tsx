import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { colleges } from "@/lib/colleges-data";
import { useSavedColleges } from "@/lib/saved-colleges";
import { CollegeCard } from "@/components/college-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Colleges — EduSphere India" },
      { name: "description", content: "Your bookmarked colleges on EduSphere India." },
      { property: "og:title", content: "Saved Colleges — EduSphere India" },
      { property: "og:description", content: "Your bookmarked colleges." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { ids } = useSavedColleges();
  const list = colleges.filter((c) => ids.includes(c.id));

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Saved Colleges</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {list.length} college{list.length === 1 ? "" : "s"} in your list
        </p>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-card p-12 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-medium">No saved colleges yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bookmark colleges to compare later.
            </p>
            <Button asChild className="mt-5">
              <Link to="/colleges">Explore colleges</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}