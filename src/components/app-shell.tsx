import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { BottomNav } from "./bottom-nav";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pb-24">{children}</main>
      <BottomNav />
      <Toaster richColors position="top-center" />
    </div>
  );
}