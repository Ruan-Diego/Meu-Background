"use client";

import { Download } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { characterDocumentPdfFilename } from "@/lib/character-form/document-filename";
import { buildCharacterDocument } from "@/lib/character-form/document-sections";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { downloadBlobFile } from "@/lib/download-text-file";

export function PdfExportButton() {
  const { getValues } = useFormContext<CharacterFormValues>();
  const doc = buildCharacterDocument(getValues());

  const handleClick = () => {
    void (async () => {
      if (doc.isEmpty) return;
      const { generateCharacterPdfBlob } = await import(
        "@/lib/character-form/generate-character-pdf"
      );
      const blob = await generateCharacterPdfBlob(doc);
      downloadBlobFile(blob, characterDocumentPdfFilename(doc));
    })();
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={doc.isEmpty}
      onClick={handleClick}
    >
      <Download data-icon="inline-start" className="size-4" />
      Baixar PDF (.pdf)
    </Button>
  );
}
