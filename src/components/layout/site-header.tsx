"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollText } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/criar", label: "Criar" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="layout-shell flex min-h-(--header-height) flex-wrap items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full px-1 py-1 transition-colors hover:text-primary"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
            <ScrollText className="size-5" aria-hidden />
          </span>
          <span className="space-y-0.5">
            <span className="block text-sm font-semibold tracking-[0.18em] uppercase">
              Meu Background
            </span>
            <span className="text-caption text-muted-foreground block">
              Backstories de RPG, passo a passo
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav
            className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1"
            aria-label="Navegação principal"
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
