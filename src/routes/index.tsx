import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  MapPin,
  Trophy,
  Award,
  Home as HomeIcon,
  IndianRupee,
  ShieldCheck,
  BadgeCheck,
  Phone,
  GraduationCap,
  Briefcase,
  Stethoscope,
  BookOpen,
  Laptop,
  FlaskConical,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/app-shell";
import { CollegeCard } from "@/components/college-card";
import { colleges } from "@/lib/colleges-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduSphere India — Find Your Dream College in India" },
      {
        name: "description",
        content:
          "Search, compare and connect with top NIRF-ranked colleges across India for B.Tech, MBA, MCA, Medicine, BBA, BA and PhD.",
      },
      { property: "og:title", content: "EduSphere India — Find Your Dream College" },
      {
        property: "og:description",
        content:
          "Verified NIRF rankings, real fees, hostel details and direct college connect — all in one place.",
      },
    ],
  }),
  component: LandingPage,
});

const quickFilters = [
  { label: "Nearby Me", icon: MapPin },
  { label: "Top NIRF Ranked", icon: Trophy },
  { label: "NAAC A++", icon: Award },
  { label: "Hostel Included", icon: HomeIcon },
  { label: "Under ₹2L / yr", icon: IndianRupee },
];

const streams = [
  { name: "B.Tech", icon: Laptop, color: "bg-primary/10 text-primary" },
  { name: "MBA", icon: Briefcase, color: "bg-secondary/10 text-secondary" },
  { name: "Medicine", icon: Stethoscope, color: "bg-destructive/10 text-destructive" },
  { name: "MCA", icon: FlaskConical, color: "bg-accent/15 text-accent" },
  { name: "BBA", icon: Users, color: "bg-primary/10 text-primary" },
  { name: "BA", icon: BookOpen, color: "bg-secondary/10 text-secondary" },
  { name: "PhD", icon: GraduationCap, color: "bg-accent/15 text-accent" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const featured = colleges.slice(0, 6);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/colleges" });
  };

  return (
    <AppShell>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-24">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-secondary" />
            Verified NIRF 2024 rankings
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Find Your Dream College{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              in India
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Search by college name, city, or course — B.Tech, MBA, BBA, BA, MCA, Medicine, PhD.
          </p>

          <form
            onSubmit={onSearch}
            className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border bg-background p-2 shadow-lg shadow-primary/5"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try 'IIT Bombay' or 'MBA in Bengaluru'"
                className="border-0 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {quickFilters.map(({ label, icon: Icon }) => (
              <Link
                key={label}
                to="/colleges"
                className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Explore by stream</h2>
            <p className="text-sm text-muted-foreground">Pick a degree to get started</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-7">
          {streams.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to="/colleges"
              className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Featured colleges</h2>
            <p className="text-sm text-muted-foreground">Top NIRF-ranked institutions across India</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/colleges">View all →</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CollegeCard key={c.id} college={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Why parents & students trust EduSphere
            </h2>
            <p className="mt-3 text-sm opacity-90 md:text-base">
              Real information, no marketing fluff. Make confident decisions.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            <ValueProp
              icon={ShieldCheck}
              title="Verified NIRF data"
              body="Rankings sourced directly from official NIRF and NAAC releases."
            />
            <ValueProp
              icon={IndianRupee}
              title="Real fees & hostels"
              body="Actual annual costs including tuition, hostel and mess."
            />
            <ValueProp
              icon={Phone}
              title="Direct college connect"
              body="Your enquiry reaches the admissions office — no middlemen."
            />
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EduSphere India · Built for students & parents across Bharat 🇮🇳
        </div>
      </footer>
    </AppShell>
  );
}

function ValueProp({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/10">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm opacity-90">{body}</p>
    </div>
  );
}
