"use client";

import { Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { characterDocumentPdfFilename } from "@/lib/character-form/document-filename";
import { buildCharacterDocument } from "@/lib/character-form/document-sections";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { downloadBlobFile } from "@/lib/download-text-file";
import { cn } from "@/lib/utils";

const PDF_EXPORT_ERROR =
  "Não foi possível gerar o PDF. Tente de novo em instantes.";

export function PdfExportButton({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
} = {}) {
  const { getValues } = useFormContext<CharacterFormValues>();
  const doc = buildCharacterDocument(getValues());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generatingRef = useRef(false);

  const handleClick = () => {
    if (doc.isEmpty || generatingRef.current) return;
    generatingRef.current = true;
    setIsGenerating(true);
    setError(null);

    void (async () => {
      try {
        const { generateCharacterPdfBlob } = await import(
          "@/lib/character-form/generate-character-pdf"
        );
        const blob = await generateCharacterPdfBlob(doc);
        downloadBlobFile(blob, characterDocumentPdfFilename(doc));
      } catch {
        setError(PDF_EXPORT_ERROR);
      } finally {
        generatingRef.current = false;
        setIsGenerating(false);
      }
    })();
  };

  return (
    <div
      className={cn(
        "flex h-full min-w-0 w-full flex-col gap-1 sm:min-h-0",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-center whitespace-normal text-center text-sm leading-snug",
          buttonClassName ??
            "h-auto min-h-9 gap-2 rounded-lg py-2.5 text-sm font-medium"
        )}
        disabled={doc.isEmpty || isGenerating}
        onClick={handleClick}
      >
        {isGenerating ? (
          <Loader2
            data-icon="inline-start"
            className="size-4 animate-spin"
            aria-hidden
          />
        ) : (
          <Download data-icon="inline-start" className="size-4" />
        )}
        {isGenerating ? "Gerando PDF…" : "Baixar PDF (.pdf)"}
      </Button>
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/25 bg-destructive/10 px-2.5 py-2 text-caption text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
