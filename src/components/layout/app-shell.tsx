import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_65%)]" />
      <SiteHeader />
      <main className="relative z-10 flex-1">{children}</main>
      <footer className="border-t border-border/70 py-6">
        <div className="layout-shell flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-caption font-medium text-foreground">
              Meu Background
            </p>
            <p className="text-caption text-muted-foreground">
              Estrutura, preview e exportação para histórias de personagem.
            </p>
          </div>
          <p className="text-caption text-muted-foreground">
            Milestone 1: fundação do fluxo guiado.
          </p>
        </div>
      </footer>
    </div>
  );
}
