import type { CharacterDocument } from "@/lib/character-form/document-sections";

/**
 * Slug rules for export filenames (Markdown, plain text, PDF).
 * Empty/whitespace-only name → `emptyBasename` (locale-specific); accented characters → ASCII slug.
 */
export function slugifyBasenameFromName(
  name: string,
  emptyBasename = "personagem"
): string {
  const trimmed = name.trim() || emptyBasename;
  const ascii = trimmed
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  const slug = ascii.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || emptyBasename;
}

export function characterDocumentMarkdownFilename(
  doc: CharacterDocument,
  emptyBasename = "personagem"
): string {
  return `${slugifyBasenameFromName(doc.header.characterName, emptyBasename)}.md`;
}

export function characterDocumentPlainTextFilename(
  doc: CharacterDocument,
  emptyBasename = "personagem"
): string {
  return `${slugifyBasenameFromName(doc.header.characterName, emptyBasename)}.txt`;
}

export function characterDocumentPdfFilename(
  doc: CharacterDocument,
  emptyBasename = "personagem"
): string {
  return `${slugifyBasenameFromName(doc.header.characterName, emptyBasename)}.pdf`;
}
