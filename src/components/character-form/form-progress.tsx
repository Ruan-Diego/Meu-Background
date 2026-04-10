"use client";

import { useIntl } from "@/components/i18n/app-intl-provider";
import { Progress } from "@/components/ui/progress";
import { FORM_STEPS, STEP_COUNT } from "@/lib/character-form/steps";
import { formatMessage } from "@/lib/i18n/format-message";
import { cn } from "@/lib/utils";

type FormProgressProps = {
  currentStepIndex: number;
  className?: string;
};

export function FormProgress({ currentStepIndex, className }: FormProgressProps) {
  const { t } = useIntl();
  const fraction = (currentStepIndex + 1) / STEP_COUNT;
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  const indexLabel =
    FORM_STEPS[currentStepIndex]?.indexLabel ?? currentStepIndex + 1;

  return (
    <Progress
      value={percent}
      className={cn("w-full flex-col gap-3", className)}
      aria-label={`${t("formProgress.label")}: ${percent}%`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-caption font-medium text-muted-foreground">
          {t("formProgress.progressTitle")}
        </p>
        <p className="text-caption tabular-nums text-muted-foreground">
          {formatMessage(t("wizard.stepHeading"), {
            current: indexLabel,
            total: STEP_COUNT,
          })}
        </p>
      </div>
    </Progress>
  );
}
