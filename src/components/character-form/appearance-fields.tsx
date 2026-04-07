"use client";

import { ExternalLink } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FieldGroup,
  textareaFieldClassName,
} from "@/components/character-form/form-field-parts";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { cn } from "@/lib/utils";

const HERO_FORGE_URL = "https://www.heroforge.com";

export function AppearanceFields() {
  const { register } = useFormContext<CharacterFormValues>();

  return (
    <div className="space-y-8">
      <div
        className="rounded-lg border border-border/80 bg-muted/25 p-4 text-body text-muted-foreground"
        role="note"
      >
        <p className="text-foreground">
          A aparência visível (rosto, pele, roupas, armadura, cabelo etc.) fica
          na{" "}
          <a
            href={HERO_FORGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            Hero Forge
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
          </a>
          , onde você monta a miniatura de referência. Aqui descreva só o que a
          miniatura ou a imagem não mostram bem na mesa ou na história.
        </p>
      </div>

      <section className="space-y-4" aria-labelledby="appearance-body-heading">
        <h3
          id="appearance-body-heading"
          className="text-sm font-semibold text-foreground"
        >
          Corpo e proporção
        </h3>
        <FieldGroup
          id="heightDescription"
          label="Altura e proporção"
        >
          <Textarea
            id="heightDescription"
            {...register("heightDescription")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: mais alto que a média do grupo; parece compacto mas é pesado; envergadura que chama atenção em multidão…"
            rows={3}
          />
        </FieldGroup>
      </section>

      <section className="space-y-4" aria-labelledby="appearance-hidden-heading">
        <h3
          id="appearance-hidden-heading"
          className="text-sm font-semibold text-foreground"
        >
          O que fica escondido
        </h3>
        <FieldGroup
          id="hiddenMarksAndScars"
          label="Cicatrizes, tatuagens ou marcas sob roupa / armadura"
        >
          <Textarea
            id="hiddenMarksAndScars"
            {...register("hiddenMarksAndScars")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: queimadura no ombro coberta pela couraça; runa íntima; dedo torto de briga antiga…"
            rows={3}
          />
        </FieldGroup>
      </section>

      <section className="space-y-4" aria-labelledby="appearance-presence-heading">
        <h3
          id="appearance-presence-heading"
          className="text-sm font-semibold text-foreground"
        >
          Presença e sensação
        </h3>
        <FieldGroup
          id="firstImpression"
          label="Primeira impressão (o que se sente ao ver ou cruzar com a pessoa)"
        >
          <Textarea
            id="firstImpression"
            {...register("firstImpression")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: ar de cansaço mesmo calmo; parece sempre avaliando a saída; calor humano que desarma…"
            rows={3}
          />
        </FieldGroup>
        <FieldGroup
          id="voiceAndSpeech"
          label="Voz e jeito de falar"
        >
          <Textarea
            id="voiceAndSpeech"
            {...register("voiceAndSpeech")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: voz rouca baixa; fala rápido quando nervoso; sotaque do litoral; pausas longas antes de responder…"
            rows={3}
          />
        </FieldGroup>
        <FieldGroup
          id="characteristicScent"
          label="Cheiro ou aroma característico"
        >
          <Textarea
            id="characteristicScent"
            {...register("characteristicScent")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: ferro e couro; ervas medicinais; tabaco; chuva na capa…"
            rows={2}
          />
        </FieldGroup>
      </section>

      <section className="space-y-4" aria-labelledby="appearance-movement-heading">
        <h3
          id="appearance-movement-heading"
          className="text-sm font-semibold text-foreground"
        >
          Movimento e hábitos
        </h3>
        <FieldGroup
          id="movementAndMannerisms"
          label="Como se move, postura, tiques ou gestos habituais"
        >
          <Textarea
            id="movementAndMannerisms"
            {...register("movementAndMannerisms")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: manca leve; passos silenciosos; costas muito eretas; roça o anel quando pensa; evita olhar nos olhos…"
            rows={3}
          />
        </FieldGroup>
      </section>

      <section className="space-y-4" aria-labelledby="appearance-extra-heading">
        <h3
          id="appearance-extra-heading"
          className="text-sm font-semibold text-foreground"
        >
          Outros detalhes
        </h3>
        <FieldGroup
          id="appearanceOtherNotes"
          label="Qualquer outro detalhe físico ou sensorial que a miniatura não mostre"
        >
          <Textarea
            id="appearanceOtherNotes"
            {...register("appearanceOtherNotes")}
            className={cn(textareaFieldClassName)}
            placeholder="Ex.: mãos calejadas de forja; parece mais velho do que a idade na ficha; temperatura da pele; reação ao toque…"
            rows={3}
          />
        </FieldGroup>
      </section>
    </div>
  );
}
