import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  MapPin,
  Users,
  TrendingUp,
  IndianRupee,
  Wifi,
  Utensils,
  Dumbbell,
  Home as HomeIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getCollegeBySlug, formatINR, type College } from "@/lib/colleges-data";
import { NirfBadge, NaacBadge } from "@/components/nirf-badge";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/college/$slug")({
  loader: ({ params }) => {
    const college = getCollegeBySlug(params.slug);
    if (!college) throw notFound();
    return { college };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "College not found" }] };
    const c = loaderData.college;
    const title = `${c.name} — Fees, NIRF Rank, Courses | EduSphere India`;
    const description = `${c.name}, ${c.city}: NIRF #${c.nirfRank}, NAAC ${c.naacGrade}. Fees ${formatINR(c.feeMin)}–${formatINR(c.feeMax)}/yr. Courses: ${c.courses.join(", ")}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: c.coverImage },
        { name: "twitter:image", content: c.coverImage },
      ],
    };
  },
  component: CollegeDetail,
  notFoundComponent: NotFoundCollege,
});

function NotFoundCollege() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">College not found</h1>
        <p className="mt-2 text-muted-foreground">
          This college doesn't exist in our database yet.
        </p>
        <Button asChild className="mt-6">
          <Link to="/colleges">Explore colleges</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function CollegeDetail() {
  const { college } = Route.useLoaderData() as { college: College };

  return (
    <AppShell>
      <div className="relative h-64 w-full overflow-hidden md:h-96">
        <img src={college.coverImage} alt={college.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-6 text-white">
          <div className="mb-3 flex flex-wrap gap-2">
            <NirfBadge rank={college.nirfRank} />
            <NaacBadge grade={college.naacGrade} />
          </div>
          <h1 className="text-2xl font-bold md:text-4xl">{college.name}</h1>
          <p className="mt-2 flex items-center gap-1 text-sm opacity-90">
            <MapPin className="h-4 w-4" />
            {college.city}, {college.state}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat
                icon={IndianRupee}
                label="Fees / yr"
                value={`${formatINR(college.feeMin)}–${formatINR(college.feeMax)}`}
              />
              <Stat icon={TrendingUp} label="Placement" value={`${college.placementRate}%`} />
              <Stat icon={Users} label="Avg package" value={`₹${college.avgPackageLpa} LPA`} />
              <Stat
                icon={HomeIcon}
                label="Hostel"
                value={college.hostelAvailable ? "Available" : "Not available"}
              />
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses & Fees</TabsTrigger>
                <TabsTrigger value="hostel">Hostel</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-5 space-y-6">
                <p className="leading-relaxed text-muted-foreground">{college.description}</p>
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
                    Campus highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {college.environmentHighlights.map((h) => (
                      <Badge key={h} variant="secondary" className="font-normal">
                        {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="mt-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Degree</TableHead>
                      <TableHead>Eligibility</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Fee / yr</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {college.courses.map((c) => (
                      <TableRow key={c}>
                        <TableCell className="font-medium">{c}</TableCell>
                        <TableCell>{eligibility(c)}</TableCell>
                        <TableCell>{duration(c)}</TableCell>
                        <TableCell className="text-right">
                          {formatINR(college.feeMin)} – {formatINR(college.feeMax)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="hostel" className="mt-5">
                {college.hostelAvailable ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      On-campus hostel available at approx{" "}
                      <strong className="text-foreground">
                        {formatINR(college.hostelFee ?? 0)}/yr
                      </strong>{" "}
                      (mess included).
                    </p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <Amenity icon={HomeIcon} label="Single & shared rooms" />
                      <Amenity icon={Utensils} label="Veg / Non-veg mess" />
                      <Amenity icon={Wifi} label="High-speed Wi-Fi" />
                      <Amenity icon={Dumbbell} label="Sports facilities" />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    This college does not offer on-campus hostel accommodation.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="mt-5">
                <Carousel>
                  <CarouselContent>
                    {college.gallery.map((src, i) => (
                      <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                        <img
                          src={src}
                          alt={`${college.name} campus ${i + 1}`}
                          loading="lazy"
                          className="h-64 w-full rounded-xl object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </TabsContent>

              <TabsContent value="location" className="mt-5 space-y-4">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {college.address}
                </p>
                <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
                  <iframe
                    title={`${college.name} map`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(college.address)}&output=embed`}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Interested in {college.name}?</p>
              <p className="mt-1 text-lg font-semibold">Get in touch with admissions</p>
              <EnquiryDialog collegeName={college.name}>
                <Button size="lg" className="mt-4 w-full">
                  Apply / Enquire Now
                </Button>
              </EnquiryDialog>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Verified admissions contact • No spam
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <EnquiryDialog collegeName={college.name}>
          <Button size="lg" className="w-full">
            Apply / Enquire Now
          </Button>
        </EnquiryDialog>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function Amenity({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center">
      <Icon className="h-5 w-5 text-secondary" />
      <p className="text-xs">{label}</p>
    </div>
  );
}

function eligibility(course: string) {
  switch (course) {
    case "B.Tech":
      return "12th (PCM) + JEE";
    case "MBA":
      return "Bachelor's + CAT/GMAT";
    case "BBA":
    case "BA":
      return "12th, any stream";
    case "MCA":
      return "Bachelor's with Maths";
    case "Medicine":
      return "12th (PCB) + NEET";
    case "PhD":
      return "Master's + entrance";
    default:
      return "As per norms";
  }
}

function duration(course: string) {
  switch (course) {
    case "B.Tech":
      return "4 years";
    case "MBA":
    case "MCA":
      return "2 years";
    case "BBA":
    case "BA":
      return "3 years";
    case "Medicine":
      return "5.5 years";
    case "PhD":
      return "3–5 years";
    default:
      return "—";
  }
}