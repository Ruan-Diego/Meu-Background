"use client";

import { Download } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { characterDocumentMarkdownFilename } from "@/lib/character-form/document-filename";
import { characterDocumentToMarkdown } from "@/lib/character-form/document-markdown";
import { buildCharacterDocument } from "@/lib/character-form/document-sections";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import { downloadTextFile } from "@/lib/download-text-file";
import { cn } from "@/lib/utils";

export function MarkdownExportButton({
  className,
}: {
  className?: string;
} = {}) {
  const { getValues } = useFormContext<CharacterFormValues>();
  const doc = buildCharacterDocument(getValues());

  const handleClick = () => {
    if (doc.isEmpty) return;
    const markdown = characterDocumentToMarkdown(doc);
    downloadTextFile(
      markdown,
      characterDocumentMarkdownFilename(doc),
      "text/markdown"
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
      Baixar Markdown (.md)
    </Button>
  );
}
