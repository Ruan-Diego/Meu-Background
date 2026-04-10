import { formatMessage } from "@/lib/i18n/format-message";
import type { DocumentSerializationLabels } from "@/lib/i18n/document-labels";
import { buildSerializationLabels } from "@/lib/i18n/document-labels";
import type { Messages } from "@/lib/i18n/messages-loader";
import type {
  CharacterDocument,
  DocumentBlock,
  DocumentEntry,
} from "@/lib/character-form/document-sections";

import ptMessages from "../../../messages/pt-BR.json";

const defaultSerializationLabels = buildSerializationLabels(
  ptMessages as Messages
);

/**
 * Escape inline markdown so user text can sit inside **bold** or *italics*
 * without breaking structure.
 */
function escapeInline(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_");
}

/**
 * Reduce the chance that user-written paragraphs are parsed as markdown
 * structure (headings, list markers, thematic breaks).
 */
function sanitizeUserParagraph(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/^(#{1,6}\s)/gm, "\\$1")
    .replace(/^(\s{0,3})([-*+])(\s)/gm, "$1\\$2$3")
    .replace(/^(\s{0,3})(\d+)(\.)(\s)/gm, "$1\\$2\\$3$4")
    .replace(/^(\s{0,3})(---+|\*{3,}|_{3,})\s*$/gm, "$1\\$2");
}

function renderEntryLines(entry: DocumentEntry): string[] {
  const lines: string[] = [];
  const hasPrimary = entry.primary.trim().length > 0;
  const hasSecondary = Boolean(entry.secondary?.trim());
  const hasHead = hasPrimary || hasSecondary;

  let head = "- ";
  if (hasPrimary) {
    head += `**${escapeInline(entry.primary.trim())}**`;
  }
  if (hasSecondary) {
    head += hasPrimary ? " — " : "";
    head += escapeInline(entry.secondary!.trim());
  }
  if (hasHead) lines.push(head);

  if (entry.detail?.trim()) {
    for (const raw of entry.detail.split("\n")) {
      const line = raw.trimEnd();
      if (!line.trim()) continue;
      const sanitized = sanitizeUserParagraph(line);
      lines.push(hasHead ? `  ${sanitized}` : `- ${sanitized}`);
    }
  }

  return lines;
}

function blockToMarkdown(
  block: DocumentBlock,
  labels: DocumentSerializationLabels
): string {
  switch (block.type) {
    case "text": {
      const body = sanitizeUserParagraph(block.value.trim());
      return `**${escapeInline(block.label)}**\n\n${body}`;
    }
    case "tags": {
      const items = block.tags.map((t) => `- ${escapeInline(t.trim())}`);
      return `**${escapeInline(block.label)}**\n\n${items.join("\n")}`;
    }
    case "entries": {
      const lines = block.entries.flatMap(renderEntryLines);
      return `**${escapeInline(block.label)}**\n\n${lines.join("\n")}`;
    }
    case "note": {
      const body = block.body.trim()
        ? sanitizeUserParagraph(block.body.trim())
        : "";
      const heading =
        block.heading.trim() || labels.defaultNoteHeading;
      return `### ${escapeInline(heading)}\n\n${body}`;
    }
  }
}

function headerToMarkdown(
  header: CharacterDocument["header"],
  labels: DocumentSerializationLabels
): string {
  const titleRaw = header.characterName.trim();
  const title = titleRaw
    ? escapeInline(titleRaw)
    : escapeInline(labels.unnamedCharacter);
  const parts: string[] = [`# ${title}`];

  if (header.playerName.trim()) {
    const byLine = formatMessage(labels.byPlayerMarkdown, {
      player: header.playerName.trim(),
    });
    parts.push("", `*${escapeInline(byLine)}*`);
  }

  if (header.meta.length > 0) {
    const metaLine = header.meta
      .map((m) => escapeInline(m.value.trim()))
      .join(" · ");
    parts.push("", `*${metaLine}*`);
  }

  return parts.join("\n");
}

/**
 * Serialize the canonical character document to GitHub-flavored Markdown.
 */
export function characterDocumentToMarkdown(
  doc: CharacterDocument,
  labels: DocumentSerializationLabels = defaultSerializationLabels
): string {
  const chunks: string[] = [headerToMarkdown(doc.header, labels)];

  for (const section of doc.sections) {
    chunks.push("", `## ${escapeInline(section.title)}`, "");
    const body = section.blocks
      .map((b) => blockToMarkdown(b, labels))
      .join("\n\n");
    chunks.push(body);
  }

  return chunks.join("\n").trimEnd() + "\n";
}
