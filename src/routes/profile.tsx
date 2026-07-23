import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
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

function ProfilePage() {
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) {
        setUser({
          email: u.email,
          name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string),
          avatar: u.user_metadata?.avatar_url as string,
        });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
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

  const handleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/profile",
    });
    if (result.error) toast.error("Sign in failed", { description: result.error.message });
  };

  if (user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-12">
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