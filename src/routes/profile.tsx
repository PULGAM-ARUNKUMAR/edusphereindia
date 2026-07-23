import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — EduSphere India" },
      { name: "description", content: "Manage your EduSphere India profile and enquiries." },
      { property: "og:title", content: "Your Profile — EduSphere India" },
      { property: "og:description", content: "Manage your EduSphere India profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold">Sign in to view your profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with Google to see saved colleges, enquiry history, and update your details.
          </p>
          <Button className="mt-6 w-full sm:w-auto">Sign in with Google</Button>
        </div>
      </div>
    </AppShell>
  );
}