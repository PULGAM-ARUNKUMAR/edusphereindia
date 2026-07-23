import { Link } from "@tanstack/react-router";
import { GraduationCap, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { to: "/colleges", label: "Explore" },
  { to: "/colleges", label: "By Degree" },
  { to: "/colleges", label: "NIRF Top 100" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Sign in failed", { description: result.error.message });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            EduSphere <span className="text-secondary">India</span>
          </span>
        </Link>

        <Link
          to="/colleges"
          className="ml-2 hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full border bg-muted/60 px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <Search className="h-4 w-4" />
          Search colleges, city, or course…
        </Link>

        <nav className="ml-auto hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Button asChild key={l.label} variant="ghost" size="sm">
              <Link to={l.to}>{l.label}</Link>
            </Button>
          ))}
          {email ? (
            <Button size="sm" variant="outline" className="ml-2" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <Button size="sm" className="ml-2" onClick={handleSignIn}>
              Sign in with Google
            </Button>
          )}
        </nav>

        <div className="ml-auto flex md:hidden items-center gap-2">
          <Link
            to="/colleges"
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-muted/60"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    {l.label}
                  </Link>
                ))}
                {email ? (
                  <Button className="mt-3" variant="outline" onClick={handleSignOut}>
                    Sign out
                  </Button>
                ) : (
                  <Button className="mt-3" onClick={handleSignIn}>
                    Sign in with Google
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}