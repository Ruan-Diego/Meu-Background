"use client";

import { Download } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { characterDocumentPlainTextFilename } from "@/lib/character-form/document-filename";
import { characterDocumentToPlainText } from "@/lib/character-form/document-plain-text";
import { buildCharacterDocument } from "@/lib/character-form/document-sections";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { downloadTextFile } from "@/lib/download-text-file";
import { cn } from "@/lib/utils";

export function PlainTextExportButton({
  className,
}: {
  className?: string;
} = {}) {
  const { getValues } = useFormContext<CharacterFormValues>();
  const doc = buildCharacterDocument(getValues());

  const handleClick = () => {
    if (doc.isEmpty) return;
    const text = characterDocumentToPlainText(doc);
    downloadTextFile(
      text,
      characterDocumentPlainTextFilename(doc),
      "text/plain"
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(className)}
      disabled={doc.isEmpty}
      onClick={handleClick}
    >
      <Download data-icon="inline-start" className="size-4" />
      Baixar texto (.txt)
    </Button>
  );
}
