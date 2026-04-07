"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { BasicInfoFields } from "@/components/character-form/basic-info-fields";
import { DocumentPreview } from "@/components/character-form/document-preview";
import { OriginBackgroundFields } from "@/components/character-form/origin-background-fields";
import { AppearanceFields } from "@/components/character-form/appearance-fields";
import { FreeNotesFields } from "@/components/character-form/free-notes-fields";
import { GoalsMotivationsFields } from "@/components/character-form/goals-motivations-fields";
import { PersonalityTraitsFields } from "@/components/character-form/personality-traits-fields";
import { FormProgress } from "@/components/character-form/form-progress";
import { StepRail } from "@/components/character-form/step-rail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  characterFormSchema,
  getTriggerPathsForStepIndex,
  mergeInitialFormValues,
  validateStepValues,
  type CharacterFormValues,
} from "@/lib/character-form/schema";
import { FORM_STEPS, STEP_COUNT, clampStepIndex } from "@/lib/character-form/steps";
import { cn } from "@/lib/utils";
import {
  type CharacterDraft,
  useCharacterStore,
} from "@/stores/character-store";

export function CharacterFormWizard({ className }: { className?: string }) {
  const currentStepIndex = useCharacterStore((s) => s.currentStepIndex);
  const setCurrentStepIndex = useCharacterStore((s) => s.setCurrentStepIndex);
  const draft = useCharacterStore((s) => s.draft);
  const setDraft = useCharacterStore((s) => s.setDraft);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: mergeInitialFormValues(
      draft as Partial<CharacterFormValues> & Record<string, unknown>
    ),
    mode: "onTouched",
  });

  const { trigger, getValues, setError, clearErrors, formState } = form;

  const persistDraft = useCallback(() => {
    setDraft(getValues() as CharacterDraft);
  }, [getValues, setDraft]);

  const goNext = useCallback(async () => {
    const stepMeta = FORM_STEPS[currentStepIndex];
    if (!stepMeta) return;

    const values = getValues();
    const paths = getTriggerPathsForStepIndex(currentStepIndex, values);
    if (paths.length > 0) {
      const ok = await trigger(paths as never);
      if (!ok) return;
    }

    const zodResult = validateStepValues(stepMeta.id, values);
    if (!zodResult.ok) {
      setError("root", { message: zodResult.message });
      return;
    }
    clearErrors("root");

    persistDraft();
    setCurrentStepIndex(clampStepIndex(currentStepIndex + 1));
  }, [
    clearErrors,
    currentStepIndex,
    getValues,
    persistDraft,
    setCurrentStepIndex,
    setError,
    trigger,
  ]);

  const goPrev = useCallback(() => {
    clearErrors("root");
    persistDraft();
    setCurrentStepIndex(clampStepIndex(currentStepIndex - 1));
  }, [
    clearErrors,
    currentStepIndex,
    persistDraft,
    setCurrentStepIndex,
  ]);

  const goToStep = useCallback(
    (index: number) => {
      clearErrors("root");
      persistDraft();
      setCurrentStepIndex(clampStepIndex(index));
    },
    [clearErrors, persistDraft, setCurrentStepIndex]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-character-wizard]") == null) return;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentStepIndex > 0) goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentStepIndex < STEP_COUNT - 1) void goNext();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        goToStep(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        goToStep(STEP_COUNT - 1);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [currentStepIndex, goNext, goPrev, goToStep]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [currentStepIndex]);

  const step = FORM_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === STEP_COUNT - 1;
  const rootError = formState.errors.root?.message;

  return (
    <div data-character-wizard className={cn("space-y-6", className)}>
      <FormProvider {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
          noValidate
        >
          <FormProgress currentStepIndex={currentStepIndex} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
            <StepRail
              currentStepIndex={currentStepIndex}
              onStepSelect={goToStep}
              className="order-2 xl:order-1"
            />

            <Card className="surface-panel order-1 overflow-hidden xl:order-2">
              <CardHeader className="border-b border-border/70">
                <p className="text-caption font-medium text-muted-foreground">
                  Etapa {step?.indexLabel} de {STEP_COUNT}
                </p>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1 text-title text-balance text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {step?.title}
                </h2>
                <CardDescription>{step?.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {step?.id === "basic" ? (
                  <BasicInfoFields />
                ) : step?.id === "origin" ? (
                  <OriginBackgroundFields />
                ) : step?.id === "personality" ? (
                  <PersonalityTraitsFields />
                ) : step?.id === "goals" ? (
                  <GoalsMotivationsFields />
                ) : step?.id === "appearance" ? (
                  <AppearanceFields />
                ) : step?.id === "freeNotes" ? (
                  <FreeNotesFields />
                ) : step?.id === "review" ? (
                  <DocumentPreview />
                ) : (
                  <p className="text-body text-muted-foreground">
                    Esta etapa ainda não tem campos definidos.
                  </p>
                )}

                {rootError ? (
                  <p
                    role="alert"
                    className="text-body text-destructive"
                  >
                    {rootError}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-caption text-muted-foreground">
                    Atalhos (fora de campos de texto): Ctrl + Shift + ← / →
                    (anterior / próxima); Ctrl + Shift + Home / End (primeira /
                    última etapa).
                  </p>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      disabled={isFirst}
                      onClick={goPrev}
                    >
                      <ChevronLeft data-icon="inline-start" />
                      Anterior
                    </Button>
                    {!isLast ? (
                      <Button
                        type="button"
                        size="default"
                        onClick={() => {
                          void goNext();
                        }}
                      >
                        Próxima
                        <ChevronRight data-icon="inline-end" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="default"
                        onClick={() => persistDraft()}
                      >
                        Guardar rascunho
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
