"use client";

import { createElement } from "react";
import type { CharacterDocument } from "@/lib/character-form/document-sections";
import { CharacterDocumentPdf } from "@/lib/character-form/document-pdf";

/**
 * Renders a {@link CharacterDocument} to a PDF blob in the browser.
 * Loads `@react-pdf/renderer` on demand so server bundles and unrelated
 * client chunks avoid a static dependency on the renderer until export runs.
 */
export async function generateCharacterPdfBlob(
  doc: CharacterDocument,
): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer");
  const root = createElement(CharacterDocumentPdf, { document: doc });
  const instance = pdf(
    root as NonNullable<Parameters<typeof pdf>[0]>,
  );
  return instance.toBlob();
}
