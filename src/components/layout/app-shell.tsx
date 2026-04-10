import type { ReactNode } from "react";

import { LocalizedFooter } from "@/components/layout/localized-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_65%)]" />
      <SiteHeader />
      <main className="relative z-10 flex-1">{children}</main>
      <LocalizedFooter />
    </div>
  );
}
