import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colleges, COURSES, formatINR } from "@/lib/colleges-data";
import { CollegeCard } from "@/components/college-card";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "Explore Colleges in India — EduSphere India" },
      {
        name: "description",
        content:
          "Search and compare top Indian colleges by NIRF ranking, NAAC grade, fees, hostel, and location. B.Tech, MBA, MCA, Medicine, and more.",
      },
      { property: "og:title", content: "Explore Colleges in India — EduSphere India" },
      {
        property: "og:description",
        content:
          "Discover verified NIRF-ranked colleges across India with real fees, hostel and placement data.",
      },
    ],
  }),
  component: CollegesPage,
});

const NAAC_GRADES = ["A++", "A+", "A", "B++"] as const;

function CollegesPage() {
  const [q, setQ] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState<number>(1500000);
  const [nirfCap, setNirfCap] = useState<string>("all");
  const [hostelOnly, setHostelOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const toggleFrom = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const filtered = useMemo(() => {
    return colleges.filter((c) => {
      if (q) {
        const s = q.toLowerCase();
        if (
          !c.name.toLowerCase().includes(s) &&
          !c.city.toLowerCase().includes(s) &&
          !c.state.toLowerCase().includes(s) &&
          !c.courses.some((x) => x.toLowerCase().includes(s))
        )
          return false;
      }
      if (selectedCourses.length && !selectedCourses.some((x) => c.courses.includes(x)))
        return false;
      if (selectedGrades.length && !selectedGrades.includes(c.naacGrade)) return false;
      if (c.feeMin > maxFee) return false;
      if (hostelOnly && !c.hostelAvailable) return false;
      if (nirfCap !== "all" && c.nirfRank > Number(nirfCap)) return false;
      return true;
    });
  }, [q, selectedCourses, selectedGrades, maxFee, nirfCap, hostelOnly]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Degree stream
        </Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {COURSES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedCourses.includes(c)}
                onCheckedChange={() => setSelectedCourses((prev) => toggleFrom(prev, c))}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Max annual fee — {formatINR(maxFee)}
        </Label>
        <Slider
          className="mt-3"
          value={[maxFee]}
          min={50000}
          max={1500000}
          step={25000}
          onValueChange={(v) => setMaxFee(v[0])}
        />
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          NIRF Ranking
        </Label>
        <Select value={nirfCap} onValueChange={setNirfCap}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="50">Top 50</SelectItem>
            <SelectItem value="100">Top 100</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          NAAC grade
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {NAAC_GRADES.map((g) => {
            const active = selectedGrades.includes(g);
            return (
              <button
                key={g}
                onClick={() => setSelectedGrades((prev) => toggleFrom(prev, g))}
                className={`rounded-full border px-3 py-1 text-xs ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm">Hostel available</Label>
        <Switch checked={hostelOnly} onCheckedChange={setHostelOnly} />
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          setSelectedCourses([]);
          setSelectedGrades([]);
          setMaxFee(1500000);
          setNirfCap("all");
          setHostelOnly(false);
          setQ("");
        }}
      >
        Clear all filters
      </Button>
    </div>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Explore Colleges</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} of {colleges.length} colleges match your filters
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search college, city, or course"
                className="pl-9"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{Filters}</div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex rounded-md border bg-background">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-l-md ${
                  view === "grid" ? "bg-muted" : ""
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-r-md ${
                  view === "list" ? "bg-muted" : ""
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border bg-card p-5">{Filters}</div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border bg-card p-12 text-center">
                <p className="text-muted-foreground">No colleges match your filters.</p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
                }
              >
                {filtered.map((c) => (
                  <CollegeCard key={c.id} college={c} view={view} />
                ))}
              </div>
            )}

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Can't find your college?{" "}
              <Link to="/contact" className="text-primary underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}