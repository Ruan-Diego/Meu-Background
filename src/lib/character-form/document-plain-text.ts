import type { DocumentSerializationLabels } from "@/lib/i18n/document-labels";
import { buildSerializationLabels } from "@/lib/i18n/document-labels";
import { formatMessage } from "@/lib/i18n/format-message";
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

function renderEntryLines(entry: DocumentEntry): string[] {
  const lines: string[] = [];
  const hasPrimary = entry.primary.trim().length > 0;
  const hasSecondary = Boolean(entry.secondary?.trim());
  const hasHead = hasPrimary || hasSecondary;

  let head = "- ";
  if (hasPrimary) {
    head += entry.primary.trim();
  }
  if (hasSecondary) {
    head += hasPrimary ? " — " : "";
    head += entry.secondary!.trim();
  }
  if (hasHead) lines.push(head);

  if (entry.detail?.trim()) {
    for (const raw of entry.detail.split("\n")) {
      const line = raw.trimEnd();
      if (!line.trim()) continue;
      lines.push(hasHead ? `  ${line}` : `- ${line}`);
    }
  }

  return lines;
}

function blockToPlainText(
  block: DocumentBlock,
  labels: DocumentSerializationLabels
): string {
  switch (block.type) {
    case "text": {
      const body = block.value.trim();
      return `${block.label}\n\n${body}`;
    }
    case "tags": {
      const items = block.tags.map((t) => `- ${t.trim()}`);
      return `${block.label}\n\n${items.join("\n")}`;
    }
    case "entries": {
      const lines = block.entries.flatMap(renderEntryLines);
      return `${block.label}\n\n${lines.join("\n")}`;
    }
    case "note": {
      const heading =
        block.heading.trim() || labels.defaultNoteHeading;
      const body = block.body.trim();
      return body ? `${heading}\n\n${body}` : heading;
    }
  }
}

function headerToPlainText(
  header: CharacterDocument["header"],
  labels: DocumentSerializationLabels
): string {
  const titleRaw = header.characterName.trim();
  const title = titleRaw || labels.unnamedCharacter;
  const underlineLen = Math.max(Math.min(title.length, 72), 3);
  const parts: string[] = [title, "=".repeat(underlineLen)];

  if (header.playerName.trim()) {
    parts.push(
      "",
      formatMessage(labels.byPlayerPlain, {
        player: header.playerName.trim(),
      })
    );
  }

  if (header.meta.length > 0) {
    const metaLine = header.meta.map((m) => m.value.trim()).join(" · ");
    parts.push("", metaLine);
  }

  return parts.join("\n");
}

/**
 * Serialize the canonical character document to plain UTF-8 text (no markup).
 */
export function characterDocumentToPlainText(
  doc: CharacterDocument,
  labels: DocumentSerializationLabels = defaultSerializationLabels
): string {
  const chunks: string[] = [headerToPlainText(doc.header, labels)];

  for (const section of doc.sections) {
    const dashLen = Math.max(Math.min(section.title.length, 72), 3);
    chunks.push("", section.title, "-".repeat(dashLen), "");
    const body = section.blocks
      .map((b) => blockToPlainText(b, labels))
      .join("\n\n");
    chunks.push(body);
  }

  return chunks.join("\n").trimEnd() + "\n";
}
