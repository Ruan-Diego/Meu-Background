import { FORM_STEPS, STEP_COUNT } from "@/lib/character-form/steps";
import { cn } from "@/lib/utils";

type FormProgressProps = {
  currentStepIndex: number;
  className?: string;
};

export function FormProgress({ currentStepIndex, className }: FormProgressProps) {
  const fraction = (currentStepIndex + 1) / STEP_COUNT;
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption font-medium text-muted-foreground">
          Progresso
        </p>
        <p className="text-caption tabular-nums text-muted-foreground">
          Etapa {FORM_STEPS[currentStepIndex]?.indexLabel ?? currentStepIndex + 1}{" "}
          de {STEP_COUNT}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso do formulário: ${percent}%`}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
