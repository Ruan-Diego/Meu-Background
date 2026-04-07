"use client";

import { FORM_STEPS, STEP_COUNT } from "@/lib/character-form/steps";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FormProgressProps = {
  currentStepIndex: number;
  className?: string;
};

export function FormProgress({ currentStepIndex, className }: FormProgressProps) {
  const fraction = (currentStepIndex + 1) / STEP_COUNT;
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100);

  return (
    <Progress
      value={percent}
      className={cn("w-full flex-col gap-3", className)}
      aria-label={`Progresso do formulário: ${percent}%`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-caption font-medium text-muted-foreground">
          Progresso
        </p>
        <p className="text-caption tabular-nums text-muted-foreground">
          Etapa {FORM_STEPS[currentStepIndex]?.indexLabel ?? currentStepIndex + 1}{" "}
          de {STEP_COUNT}
        </p>
      </div>
    </Progress>
  );
}
