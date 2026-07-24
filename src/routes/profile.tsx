import { createFileRoute } from "@tanstack/react-router";
import { User, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const QUALIFICATIONS = [
  "10th",
  "12th",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
] as const;

type AcademicProfile = {
  date_of_birth: string | null;
  highest_qualification: string | null;
  board_university: string | null;
  year_of_passing: number | null;
  percentage_cgpa: string | null;
};

function calcAge(dob: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

function ProfilePage() {
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [academic, setAcademic] = useState<AcademicProfile>({
    date_of_birth: null,
    highest_qualification: null,
    board_university: null,
    year_of_passing: null,
    percentage_cgpa: null,
  });
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) {
        setUserId(u.id);
        setUser({
          email: u.email,
          name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string),
          avatar: u.user_metadata?.avatar_url as string,
        });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUserId(u?.id ?? null);
      setUser(
        u
          ? {
              email: u.email,
              name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string),
              avatar: u.user_metadata?.avatar_url as string,
            }
          : null,
      );
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoadingProfile(true);
    supabase
      .from("profiles")
      .select(
        "date_of_birth, highest_qualification, board_university, year_of_passing, percentage_cgpa",
      )
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          toast.error("Could not load profile", { description: error.message });
        } else if (data) {
          setAcademic({
            date_of_birth: data.date_of_birth ?? null,
            highest_qualification: data.highest_qualification ?? null,
            board_university: data.board_university ?? null,
            year_of_passing: data.year_of_passing ?? null,
            percentage_cgpa: data.percentage_cgpa ?? null,
          });
        }
        setLoadingProfile(false);
      });
  }, [userId]);

  const saveAcademic = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        date_of_birth: academic.date_of_birth,
        highest_qualification: academic.highest_qualification,
        board_university: academic.board_university,
        year_of_passing: academic.year_of_passing,
        percentage_cgpa: academic.percentage_cgpa,
      })
      .eq("id", userId);
    setSaving(false);
    if (error) toast.error("Save failed", { description: error.message });
    else toast.success("Profile updated");
  };

  const handleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/profile",
    });
    if (result.error) toast.error("Sign in failed", { description: result.error.message });
  };

  if (user) {
    const age = calcAge(academic.date_of_birth);
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
          <div className="rounded-2xl border bg-card p-8 text-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name ?? "You"}
                className="mx-auto h-16 w-16 rounded-full"
              />
            ) : (
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </span>
            )}
            <h1 className="mt-4 text-xl font-semibold">{user.name ?? "Welcome"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            {age !== null && (
              <p className="mt-1 text-sm text-muted-foreground">Age: {age} years</p>
            )}
            <Button
              className="mt-6"
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                toast.success("Signed out");
              }}
            >
              Sign out
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Academic details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your qualifications so colleges can match you better.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={academic.date_of_birth ?? ""}
                  onChange={(e) =>
                    setAcademic((a) => ({ ...a, date_of_birth: e.target.value || null }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Highest qualification</Label>
                <Select
                  value={academic.highest_qualification ?? undefined}
                  onValueChange={(v) =>
                    setAcademic((a) => ({ ...a, highest_qualification: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALIFICATIONS.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="board">Board / University</Label>
                <Input
                  id="board"
                  placeholder="e.g. CBSE, University of Mumbai"
                  maxLength={150}
                  value={academic.board_university ?? ""}
                  onChange={(e) =>
                    setAcademic((a) => ({ ...a, board_university: e.target.value || null }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="yop">Year of passing</Label>
                <Input
                  id="yop"
                  type="number"
                  min={1970}
                  max={new Date().getFullYear() + 6}
                  placeholder="2024"
                  value={academic.year_of_passing ?? ""}
                  onChange={(e) =>
                    setAcademic((a) => ({
                      ...a,
                      year_of_passing: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="score">Percentage / CGPA</Label>
                <Input
                  id="score"
                  placeholder="e.g. 88% or 9.1 CGPA"
                  maxLength={20}
                  value={academic.percentage_cgpa ?? ""}
                  onChange={(e) =>
                    setAcademic((a) => ({ ...a, percentage_cgpa: e.target.value || null }))
                  }
                />
              </div>
            </div>
            <Button className="mt-6" onClick={saveAcademic} disabled={saving || loadingProfile}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

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
          <Button className="mt-6 w-full sm:w-auto" onClick={handleSignIn}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </AppShell>
  );
}