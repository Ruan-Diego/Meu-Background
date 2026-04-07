import type { CharacterDocument } from "@/lib/character-form/document-sections";

/**
 * Slug rules for export filenames (Markdown, plain text, PDF).
 * Empty/whitespace-only name → `personagem`; accented characters → ASCII slug.
 */
export function slugifyBasenameFromName(name: string): string {
  const trimmed = name.trim() || "personagem";
  const ascii = trimmed
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  const slug = ascii.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "personagem";
}

export function characterDocumentMarkdownFilename(
  doc: CharacterDocument
): string {
  return `${slugifyBasenameFromName(doc.header.characterName)}.md`;
}

export function characterDocumentPlainTextFilename(
  doc: CharacterDocument
): string {
  return `${slugifyBasenameFromName(doc.header.characterName)}.txt`;
}

export function characterDocumentPdfFilename(doc: CharacterDocument): string {
  return `${slugifyBasenameFromName(doc.header.characterName)}.pdf`;
}
