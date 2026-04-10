"use client";

import { Download } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { useIntl } from "@/components/i18n/app-intl-provider";
import { Button } from "@/components/ui/button";
import {
  buildDocumentLabels,
  buildSerializationLabels,
} from "@/lib/i18n/document-labels";
import type { Messages } from "@/lib/i18n/messages-loader";
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
  const { messages, t } = useIntl();
  const documentLabels = useMemo(
    () => buildDocumentLabels(messages as Messages),
    [messages],
  );
  const serializationLabels = useMemo(
    () => buildSerializationLabels(messages as Messages),
    [messages],
  );
  const emptyBasename = t("filename.emptyBasename");
  const doc = buildCharacterDocument(getValues(), documentLabels);

  const handleClick = () => {
    if (doc.isEmpty) return;
    const text = characterDocumentToPlainText(doc, serializationLabels);
    downloadTextFile(
      text,
      characterDocumentPlainTextFilename(doc, emptyBasename),
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
      {t("export.plainTextButton")}
    </Button>
  );
}
