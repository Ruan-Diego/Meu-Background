import { formatMessage } from "@/lib/i18n/format-message";
import type { DocumentBuildLabels } from "@/lib/i18n/document-labels";
import { buildDocumentLabels } from "@/lib/i18n/document-labels";
import type { Messages } from "@/lib/i18n/messages-loader";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import type { PersonalityFearLevel } from "@/lib/character-form/personality-constants";

import ptMessages from "../../../messages/pt-BR.json";

export type { DocumentBuildLabels };

// ---------------------------------------------------------------------------
// Types — shared between preview (M1-F10) and future exports (M1-F11/12/13)
// ---------------------------------------------------------------------------

export type DocumentHeader = {
  characterName: string;
  playerName: string;
  /** Compact metadata items for the header line (age, race, class, occupation). */
  meta: { label: string; value: string }[];
};

export type DocumentEntry = {
  primary: string;
  secondary?: string;
  detail?: string;
};

export type DocumentBlock =
  | { type: "text"; label: string; value: string }
  | { type: "tags"; label: string; tags: string[] }
  | { type: "entries"; label: string; entries: DocumentEntry[] }
  | { type: "note"; heading: string; body: string };

export type DocumentSection = {
  id: string;
  title: string;
  blocks: DocumentBlock[];
};

export type CharacterDocument = {
  header: DocumentHeader;
  sections: DocumentSection[];
  isEmpty: boolean;
};

const defaultDocumentLabels = buildDocumentLabels(ptMessages as Messages);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nonEmpty(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function arrayHasContent<T extends Record<string, unknown>>(
  arr: T[] | undefined,
  keys: (keyof T)[]
): boolean {
  if (!arr || arr.length === 0) return false;
  return arr.some((row) =>
    keys.some((k) => {
      const v = row[k];
      return typeof v === "string" && v.trim().length > 0;
    })
  );
}

// ---------------------------------------------------------------------------
// Section builders (wizard order)
// ---------------------------------------------------------------------------

function buildOriginSection(
  v: CharacterFormValues,
  L: DocumentBuildLabels
): DocumentSection | null {
  const blocks: DocumentBlock[] = [];
  const s = L.sections.origin;

  const placeParts = [v.birthCountry, v.birthRegion, v.birthCity].filter(
    nonEmpty
  );
  if (placeParts.length > 0) {
    blocks.push({
      type: "text",
      label: s.birthPlace,
      value: placeParts.join(" · "),
    });
  }

  if (arrayHasContent(v.relatives, ["kinship", "name", "background"])) {
    const entries: DocumentEntry[] = v.relatives
      .filter((r) => nonEmpty(r.kinship) || nonEmpty(r.name) || nonEmpty(r.background))
      .map((r) => ({
        primary: [r.kinship, r.name].filter(nonEmpty).join(": "),
        detail: r.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.relatives, entries });
    }
  }

  if (
    arrayHasContent(v.shapingEvents, ["eventName", "myAge", "description"])
  ) {
    const entries: DocumentEntry[] = v.shapingEvents
      .filter(
        (e) =>
          nonEmpty(e.eventName) ||
          nonEmpty(e.myAge) ||
          nonEmpty(e.description)
      )
      .map((e) => ({
        primary: e.eventName || L.defaults.eventName,
        secondary: nonEmpty(e.myAge)
          ? formatMessage(L.defaults.shapingAgeTemplate, { age: e.myAge.trim() })
          : undefined,
        detail: e.description || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.events, entries });
    }
  }

  if (nonEmpty(v.occupation)) {
    blocks.push({ type: "text", label: s.occupation, value: v.occupation });
  }

  return blocks.length > 0
    ? { id: "origin", title: s.title, blocks }
    : null;
}

function buildPersonalitySection(
  v: CharacterFormValues,
  L: DocumentBuildLabels
): DocumentSection | null {
  const blocks: DocumentBlock[] = [];
  const s = L.sections.personality;

  if (v.temperamentTags.length > 0) {
    blocks.push({
      type: "tags",
      label: s.temperament,
      tags: v.temperamentTags,
    });
  }

  if (v.valueTags.length > 0) {
    blocks.push({ type: "tags", label: s.values, tags: v.valueTags });
  }

  if (arrayHasContent(v.flaws, ["text", "background"])) {
    const entries = v.flaws
      .filter((f) => nonEmpty(f.text) || nonEmpty(f.background))
      .map((f) => ({
        primary: f.text,
        detail: f.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.flaws, entries });
    }
  }

  if (arrayHasContent(v.fears, ["description", "level", "background"])) {
    const entries = v.fears
      .filter(
        (f) => nonEmpty(f.description) || nonEmpty(f.background)
      )
      .map((f) => ({
        primary: f.description,
        secondary:
          L.fearLevelLabels[f.level as PersonalityFearLevel] ??
          f.level ??
          undefined,
        detail: f.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.fears, entries });
    }
  }

  if (arrayHasContent(v.habits, ["text", "background"])) {
    const entries = v.habits
      .filter((h) => nonEmpty(h.text) || nonEmpty(h.background))
      .map((h) => ({
        primary: h.text,
        detail: h.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.habits, entries });
    }
  }

  if (arrayHasContent(v.quirks, ["text", "background"])) {
    const entries = v.quirks
      .filter((q) => nonEmpty(q.text) || nonEmpty(q.background))
      .map((q) => ({
        primary: q.text,
        detail: q.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.quirks, entries });
    }
  }

  return blocks.length > 0
    ? { id: "personality", title: s.title, blocks }
    : null;
}

function buildGoalsSection(
  v: CharacterFormValues,
  L: DocumentBuildLabels
): DocumentSection | null {
  const blocks: DocumentBlock[] = [];
  const s = L.sections.goals;

  if (arrayHasContent(v.shortTermGoals, ["meta", "description"])) {
    const entries = v.shortTermGoals
      .filter((g) => nonEmpty(g.meta) || nonEmpty(g.description))
      .map((g) => ({
        primary: g.meta,
        detail: g.description || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: s.shortTerm, entries });
    }
  }

  if (arrayHasContent(v.lifeGoals, ["objective", "description"])) {
    const entries = v.lifeGoals
      .filter((g) => nonEmpty(g.objective) || nonEmpty(g.description))
      .map((g) => ({
        primary: g.objective,
        detail: g.description || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({
        type: "entries",
        label: s.life,
        entries,
      });
    }
  }

  return blocks.length > 0
    ? { id: "goals", title: s.title, blocks }
    : null;
}

function buildAppearanceSection(
  v: CharacterFormValues,
  L: DocumentBuildLabels
): DocumentSection | null {
  const blocks: DocumentBlock[] = [];
  const s = L.sections.appearance;

  const fields: { label: string; key: keyof CharacterFormValues }[] = [
    { label: s.height, key: "heightDescription" },
    { label: s.hiddenMarks, key: "hiddenMarksAndScars" },
    { label: s.firstImpression, key: "firstImpression" },
    { label: s.voice, key: "voiceAndSpeech" },
    { label: s.movement, key: "movementAndMannerisms" },
  ];

  for (const { label, key } of fields) {
    const val = v[key];
    if (typeof val === "string" && nonEmpty(val)) {
      blocks.push({ type: "text", label, value: val });
    }
  }

  return blocks.length > 0
    ? { id: "appearance", title: s.title, blocks }
    : null;
}

function buildFreeNotesSection(
  v: CharacterFormValues,
  L: DocumentBuildLabels
): DocumentSection | null {
  if (!arrayHasContent(v.freeNotes, ["topic", "description"])) return null;

  const noteHeading = L.defaults.noteHeading;
  const blocks: DocumentBlock[] = v.freeNotes
    .filter((n) => nonEmpty(n.topic) || nonEmpty(n.description))
    .map((n) => ({
      type: "note" as const,
      heading: n.topic || noteHeading,
      body: n.description,
    }));

  return blocks.length > 0
    ? { id: "freeNotes", title: L.sections.freeNotes.title, blocks }
    : null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build the canonical character document from form values.
 *
 * Section order follows the wizard: Basic Info (→ header), Origin, Personality,
 * Goals, Appearance, Free Notes. Empty sections are omitted.
 *
 * Pass {@link DocumentBuildLabels} from the active UI locale so preview and exports stay aligned (M2-F02).
 */
export function buildCharacterDocument(
  values: CharacterFormValues,
  labels: DocumentBuildLabels = defaultDocumentLabels
): CharacterDocument {
  const hm = labels.headerMeta;
  const header: DocumentHeader = {
    characterName: values.characterName,
    playerName: values.playerName,
    meta: [
      { label: hm.age, value: values.age },
      { label: hm.race, value: values.race },
      { label: hm.characterClass, value: values.characterClass },
      { label: hm.occupation, value: values.occupation },
    ].filter((m) => nonEmpty(m.value)),
  };

  const sections = [
    buildOriginSection(values, labels),
    buildPersonalitySection(values, labels),
    buildGoalsSection(values, labels),
    buildAppearanceSection(values, labels),
    buildFreeNotesSection(values, labels),
  ].filter((s): s is DocumentSection => s !== null);

  const hasHeaderContent =
    nonEmpty(header.characterName) ||
    nonEmpty(header.playerName) ||
    header.meta.length > 0;

  return {
    header,
    sections,
    isEmpty: !hasHeaderContent && sections.length === 0,
  };
}
