"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FieldGroup({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className="text-caption font-medium text-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role="alert" className="text-caption text-destructive">
      {message ?? "Verifique este campo."}
    </p>
  );
}

/** Applied to shadcn Input / Textarea for parity with the previous form controls. */
export const inputFieldClassName = "h-9 shadow-xs bg-background";

export const textareaFieldClassName =
  "min-h-[88px] resize-y py-2 shadow-xs bg-background";
