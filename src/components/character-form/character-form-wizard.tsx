"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  FileCode2,
  FileText,
  FileType,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { BasicInfoFields } from "@/components/character-form/basic-info-fields";
import { DocumentPreview } from "@/components/character-form/document-preview";
import {
  ExportFormatTile,
  exportDownloadButtonClassName,
} from "@/components/character-form/export-format-tile";
import { MarkdownExportButton } from "@/components/character-form/markdown-export-button";
import { PdfExportButton } from "@/components/character-form/pdf-export-button";
import { PlainTextExportButton } from "@/components/character-form/plain-text-export-button";
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
  CardTitle,
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
  const setDraft = useCharacterStore((s) => s.setDraft);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterFormSchema),
    // Match SSR: persist may already have rehydrated on the client before mount,
    // which would mismatch server HTML. Draft is applied in useLayoutEffect after hydration.
    defaultValues: mergeInitialFormValues({}),
    mode: "onTouched",
  });

  const {
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors: formErrors, isDirty },
    watch,
    reset,
  } = form;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const persistDraft = useCallback(() => {
    setDraft(getValues() as CharacterDraft);
  }, [getValues, setDraft]);

  const DRAFT_DEBOUNCE_MS = 300;
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushDraftToStore = useCallback(() => {
    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    persistDraft();
  }, [persistDraft]);

  const scheduleDraftToStore = useCallback(() => {
    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      persistDraft();
    }, DRAFT_DEBOUNCE_MS);
  }, [persistDraft]);

  const resetRef = useRef(reset);
  const watchRef = useRef(watch);
  const scheduleDraftToStoreRef = useRef(scheduleDraftToStore);
  const flushDraftToStoreRef = useRef(flushDraftToStore);
  resetRef.current = reset;
  watchRef.current = watch;
  scheduleDraftToStoreRef.current = scheduleDraftToStore;
  flushDraftToStoreRef.current = flushDraftToStore;

  useLayoutEffect(() => {
    const applyStoreDraftToForm = () => {
      if (isDirtyRef.current) return;
      const { draft: storeDraft } = useCharacterStore.getState();
      resetRef.current(
        mergeInitialFormValues(
          storeDraft as Partial<CharacterFormValues> & Record<string, unknown>
        )
      );
    };

    if (useCharacterStore.persist.hasHydrated()) {
      applyStoreDraftToForm();
    }

    const unsub = useCharacterStore.persist.onFinishHydration(() => {
      applyStoreDraftToForm();
    });
    return () => {
      unsub();
    };
  }, []);

  useLayoutEffect(() => {
    const sub = watchRef.current(() => {
      scheduleDraftToStoreRef.current();
    });
    return () => {
      sub.unsubscribe();
      flushDraftToStoreRef.current();
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushDraftToStoreRef.current();
    };
    const onPageHide = () => {
      flushDraftToStoreRef.current();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

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
  const rootError = formErrors.root?.message;

  return (
    <div data-character-wizard className={cn("space-y-6", className)}>
      <FormProvider {...form}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="order-1 min-w-0 space-y-6"
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
                  ) : step?.id === "export" ? (
                    <div className="space-y-6">
                      <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/6 p-4 dark:bg-primary/9">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                          <Sparkles
                            className="size-5"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </span>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            Quase lá — escolha como baixar
                          </p>
                          <p className="text-body text-muted-foreground text-pretty leading-relaxed">
                            O preview ao lado mostra o documento completo. Cada
                            opção gera um arquivo pronto no seu dispositivo, sem
                            servidor.
                          </p>
                        </div>
                      </div>
                      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch xl:grid-cols-3">
                        <ExportFormatTile
                          icon={FileCode2}
                          title="Markdown"
                          description="Ótimo para Notion, Obsidian ou repositórios."
                        >
                          <MarkdownExportButton
                            className={exportDownloadButtonClassName}
                          />
                        </ExportFormatTile>
                        <ExportFormatTile
                          icon={FileText}
                          title="Texto puro"
                          description="Compatível com qualquer editor de texto."
                        >
                          <PlainTextExportButton
                            className={exportDownloadButtonClassName}
                          />
                        </ExportFormatTile>
                        <ExportFormatTile
                          icon={FileType}
                          title="PDF"
                          description="Layout fixo para imprimir ou arquivar."
                        >
                          <PdfExportButton
                            buttonClassName={exportDownloadButtonClassName}
                          />
                        </ExportFormatTile>
                      </div>
                    </div>
                  ) : null}

                  {rootError ? (
                    <p
                      role="alert"
                      className="text-body text-destructive"
                    >
                      {rootError}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap justify-end gap-2">
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
                </CardContent>
              </Card>
            </div>
          </form>

          <Card className="order-2 flex min-h-0 min-w-0 flex-col overflow-hidden border-border/70 lg:sticky lg:top-28 lg:max-h-[min(40rem,calc(100vh-7rem))] lg:self-start">
            <CardHeader className="shrink-0 border-b border-border/70">
              <CardTitle>Preview do documento</CardTitle>
              <CardDescription>
                Atualiza enquanto você preenche as etapas. Use a etapa
                Exportação para baixar o arquivo.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto pt-6">
              <DocumentPreview />
            </CardContent>
          </Card>
        </div>
      </FormProvider>
    </div>
  );
}
