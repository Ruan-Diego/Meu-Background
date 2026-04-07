import type {
  CharacterDocument,
  DocumentBlock,
  DocumentEntry,
} from "@/lib/character-form/document-sections";

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

function blockToMarkdown(block: DocumentBlock): string {
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
      return `### ${escapeInline(block.heading.trim() || "Nota")}\n\n${body}`;
    }
  }
}

function headerToMarkdown(header: CharacterDocument["header"]): string {
  const titleRaw = header.characterName.trim();
  const title = titleRaw ? escapeInline(titleRaw) : "Sem nome";
  const parts: string[] = [`# ${title}`];

  if (header.playerName.trim()) {
    parts.push(
      "",
      `*Por ${escapeInline(header.playerName.trim())}*`
    );
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
export function characterDocumentToMarkdown(doc: CharacterDocument): string {
  const chunks: string[] = [headerToMarkdown(doc.header)];

  for (const section of doc.sections) {
    chunks.push("", `## ${escapeInline(section.title)}`, "");
    const body = section.blocks.map(blockToMarkdown).join("\n\n");
    chunks.push(body);
  }

  return chunks.join("\n").trimEnd() + "\n";
}

function slugifyBasename(name: string): string {
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
  return `${slugifyBasename(doc.header.characterName)}.md`;
}
