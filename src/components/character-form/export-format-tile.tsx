import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared styles for download actions inside export tiles */
export const exportDownloadButtonClassName = cn(
  "h-auto min-h-11 w-full justify-center gap-2 rounded-xl px-3 whitespace-normal py-3 text-center text-sm font-semibold leading-snug shadow-sm",
  "border-primary/20 bg-background/90 transition-[background-color,box-shadow,border-color,transform] duration-200",
  "hover:border-primary/40 hover:bg-primary/8 hover:shadow-md",
  "active:translate-y-px disabled:hover:translate-y-0 disabled:hover:border-border disabled:hover:bg-transparent disabled:hover:shadow-sm"
);

type ExportFormatTileProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
};

export function ExportFormatTile({
  icon: Icon,
  title,
  description,
  className,
  children,
}: ExportFormatTileProps) {
  return (
    <div
      className={cn(
        "flex h-full min-w-0 flex-col gap-4 rounded-2xl border border-border/80 bg-linear-to-b from-card to-muted/15 p-4 shadow-(--shadow-soft) ring-1 ring-black/3 transition-[border-color,box-shadow] duration-200 dark:ring-white/4",
        "has-[[data-slot=button]:disabled]:opacity-[0.5] has-[[data-slot=button]:disabled]:shadow-none",
        "hover:border-primary/30 hover:shadow-md has-[[data-slot=button]:disabled]:hover:border-border/80 has-[[data-slot=button]:disabled]:hover:shadow-(--shadow-soft)",
        className
      )}
    >
      {/* Ícone + título numa linha; descrição em largura total do card (evita coluna estreita em grelha 3×) */}
      <div className="min-w-0 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15"
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <p className="min-w-0 text-sm font-semibold tracking-tight text-foreground">
            {title}
          </p>
        </div>
        <p className="text-caption leading-normal text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
      <div className="mt-auto flex min-w-0 flex-col gap-2">{children}</div>
    </div>
  );
}
