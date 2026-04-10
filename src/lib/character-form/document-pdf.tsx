"use client";

import type { ReactNode } from "react";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { PdfChromeLabels } from "@/lib/i18n/document-labels";
import type {
  CharacterDocument,
  DocumentBlock,
  DocumentEntry,
  DocumentHeader,
  DocumentSection,
} from "@/lib/character-form/document-sections";

/** Noto Sans (latin-ext) for Portuguese / Latin Extended glyphs (PDF-05). */
const NOTO_SANS_LATIN_EXT_400 =
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.2.5/files/noto-sans-latin-ext-400-normal.woff";
const NOTO_SANS_LATIN_EXT_400_ITALIC =
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.2.5/files/noto-sans-latin-ext-400-italic.woff";
const NOTO_SANS_LATIN_EXT_700 =
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.2.5/files/noto-sans-latin-ext-700-normal.woff";
const NOTO_SANS_LATIN_EXT_700_ITALIC =
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.2.5/files/noto-sans-latin-ext-700-italic.woff";

let fontsRegistered = false;

function ensureCharacterPdfFonts(): void {
  if (fontsRegistered) return;
  fontsRegistered = true;
  Font.register({
    family: "NotoSans",
    fonts: [
      { src: NOTO_SANS_LATIN_EXT_400, fontWeight: 400 },
      {
        src: NOTO_SANS_LATIN_EXT_400_ITALIC,
        fontWeight: 400,
        fontStyle: "italic",
      },
      { src: NOTO_SANS_LATIN_EXT_700, fontWeight: 700 },
      {
        src: NOTO_SANS_LATIN_EXT_700_ITALIC,
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });
}

ensureCharacterPdfFonts();

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 10,
    lineHeight: 1.45,
    paddingTop: 54,
    paddingBottom: 54,
    paddingHorizontal: 52,
    color: "#1a1a1a",
  },
  headerBlock: {
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    paddingBottom: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  titlePlaceholder: {
    fontSize: 22,
    fontStyle: "italic",
    color: "#737373",
    marginBottom: 6,
  },
  playerLine: {
    fontSize: 10,
    color: "#525252",
    marginBottom: 4,
  },
  metaLine: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#525252",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 4,
    marginBottom: 10,
  },
  blockLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#525252",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  blockBody: {
    fontSize: 10,
    marginBottom: 12,
  },
  bulletLine: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 10,
  },
  entryDetail: {
    fontSize: 9,
    color: "#404040",
    marginLeft: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  noteHeading: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 4,
  },
  noteBodyLine: {
    fontSize: 10,
    color: "#404040",
    marginBottom: 2,
  },
  orphanGroup: {
    marginBottom: 4,
  },
  blockGroup: {
    marginBottom: 12,
  },
  sectionRoot: {
    marginBottom: 8,
  },
});

function PdfHeader({
  header,
  chrome,
}: {
  header: DocumentHeader;
  chrome: PdfChromeLabels;
}) {
  const hasName = header.characterName.trim().length > 0;
  const hasPlayer = header.playerName.trim().length > 0;
  const hasMeta = header.meta.length > 0;

  if (!hasName && !hasPlayer && !hasMeta) return null;

  return (
    <View style={styles.headerBlock}>
      {hasName ? (
        <Text style={styles.title}>{header.characterName}</Text>
      ) : (
        <Text style={styles.titlePlaceholder}>{chrome.unnamedCharacter}</Text>
      )}
      {hasPlayer && (
        <Text style={styles.playerLine}>
          {chrome.byPlayerPrefix}
          {header.playerName}
        </Text>
      )}
      {hasMeta && (
        <Text style={styles.metaLine}>
          {header.meta.map((m) => m.value).join(" · ")}
        </Text>
      )}
    </View>
  );
}

function PdfEntryLines({ entry }: { entry: DocumentEntry }) {
  const hasPrimary = entry.primary.trim().length > 0;
  const hasSecondary = Boolean(entry.secondary?.trim());
  const hasHead = hasPrimary || hasSecondary;

  const headParts: ReactNode[] = [];
  if (hasPrimary) {
    headParts.push(
      <Text key="p" style={{ fontWeight: 700 }}>
        {entry.primary.trim()}
      </Text>
    );
  }
  if (hasSecondary) {
    headParts.push(
      <Text key="s" style={{ fontWeight: 400, color: "#525252" }}>
        {hasPrimary ? " — " : ""}
        {entry.secondary!.trim()}
      </Text>
    );
  }

  const lines: ReactNode[] = [];
  if (hasHead) {
    lines.push(
      <Text key="head" style={styles.bulletLine}>
        <Text>• </Text>
        {headParts}
      </Text>
    );
  }

  if (entry.detail?.trim()) {
    for (const raw of entry.detail.split("\n")) {
      const line = raw.trimEnd();
      if (!line.trim()) continue;
      lines.push(
        <Text key={`d-${lines.length}`} style={styles.entryDetail}>
          {hasHead ? line : `• ${line}`}
        </Text>
      );
    }
  }

  return <View>{lines}</View>;
}

function PdfBlock({
  block,
  chrome,
}: {
  block: DocumentBlock;
  chrome: PdfChromeLabels;
}) {
  switch (block.type) {
    case "text":
      return (
        <View>
          <Text style={styles.blockLabel}>{block.label}</Text>
          <Text style={styles.blockBody}>{block.value}</Text>
        </View>
      );
    case "tags":
      return (
        <View style={styles.blockGroup}>
          <Text style={styles.blockLabel}>{block.label}</Text>
          <View>
            {block.tags.map((tag) => (
              <Text key={tag} style={styles.bulletLine}>
                • {tag.trim()}
              </Text>
            ))}
          </View>
        </View>
      );
    case "entries":
      return (
        <View style={styles.blockGroup}>
          <Text style={styles.blockLabel}>{block.label}</Text>
          <View>
            {block.entries.map((entry, i) => (
              <PdfEntryLines key={i} entry={entry} />
            ))}
          </View>
        </View>
      );
    case "note": {
      const heading =
        block.heading.trim() || chrome.defaultNoteHeading;
      return (
        <View style={styles.blockGroup}>
          <Text style={styles.noteHeading}>{heading}</Text>
          {block.body.trim()
            ? block.body.split("\n").map((raw, i) => {
                const line = raw.trimEnd();
                return (
                  <Text key={i} style={styles.noteBodyLine}>
                    {line.length > 0 ? line : " "}
                  </Text>
                );
              })
            : null}
        </View>
      );
    }
  }
}

function PdfSection({
  section,
  chrome,
}: {
  section: DocumentSection;
  chrome: PdfChromeLabels;
}) {
  const [firstBlock, ...restBlocks] = section.blocks;

  return (
    <View style={styles.sectionRoot}>
      <View style={styles.orphanGroup} minPresenceAhead={96} wrap>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {firstBlock ? (
          <PdfBlock block={firstBlock} chrome={chrome} />
        ) : null}
      </View>
      {restBlocks.map((block, i) => (
        <PdfBlock key={i} block={block} chrome={chrome} />
      ))}
    </View>
  );
}

export type CharacterDocumentPdfProps = {
  /** Canonical character document (not raw form values). */
  document: CharacterDocument;
  chrome: PdfChromeLabels;
};

/**
 * React-PDF tree for a character sheet. Root {@link Document} for use with
 * `pdf()` from `@react-pdf/renderer` (client-only).
 */
export function CharacterDocumentPdf({
  document: doc,
  chrome,
}: CharacterDocumentPdfProps) {
  const titleRaw = doc.header.characterName.trim();
  const docTitle = titleRaw || chrome.unnamedCharacter;

  return (
    <Document language={chrome.documentLanguage} title={docTitle}>
      <Page size="A4" style={styles.page} wrap>
        <PdfHeader header={doc.header} chrome={chrome} />
        {doc.sections.map((section) => (
          <PdfSection key={section.id} section={section} chrome={chrome} />
        ))}
      </Page>
    </Document>
  );
}
