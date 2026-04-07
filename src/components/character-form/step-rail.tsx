import { FORM_STEPS } from "@/lib/character-form/steps";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StepRailProps = {
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
  className?: string;
};

export function StepRail({
  currentStepIndex,
  onStepSelect,
  className,
}: StepRailProps) {
  return (
    <nav
      aria-label="Etapas do formulário"
      className={cn("flex flex-col gap-1", className)}
    >
      <ol className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">
        {FORM_STEPS.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          return (
            <li key={step.id}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onStepSelect(index)}
                className={cn(
                  "h-auto min-h-0 w-full flex-col items-stretch justify-start gap-0 rounded-2xl border px-3 py-2.5 text-left font-normal whitespace-normal transition-colors",
                  isCurrent &&
                    "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10 hover:bg-primary/10",
                  !isCurrent &&
                    isPast &&
                    "border-border/70 bg-background/70 hover:bg-muted/60",
                  !isCurrent &&
                    !isPast &&
                    "border-border/70 bg-background/50 hover:bg-muted/40"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="text-caption text-muted-foreground">
                  Etapa {step.indexLabel}
                </span>
                <span className="mt-0.5 font-medium leading-snug">
                  {step.title}
                </span>
              </Button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
