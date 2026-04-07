import type { CharacterFormValues } from "@/lib/character-form/schema";
import { PERSONALITY_FEAR_LEVEL_LABELS } from "@/lib/character-form/personality-constants";

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

function buildOriginSection(v: CharacterFormValues): DocumentSection | null {
  const blocks: DocumentBlock[] = [];

  const placeParts = [v.birthCountry, v.birthRegion, v.birthCity].filter(
    nonEmpty
  );
  if (placeParts.length > 0) {
    blocks.push({
      type: "text",
      label: "Local de nascimento",
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
      blocks.push({ type: "entries", label: "Parentes e vínculos", entries });
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
        primary: e.eventName || "Evento",
        secondary: nonEmpty(e.myAge) ? `aos ${e.myAge}` : undefined,
        detail: e.description || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: "Eventos marcantes", entries });
    }
  }

  if (nonEmpty(v.occupation)) {
    blocks.push({ type: "text", label: "Ocupação", value: v.occupation });
  }

  return blocks.length > 0
    ? { id: "origin", title: "Origem e Histórico", blocks }
    : null;
}

function buildPersonalitySection(
  v: CharacterFormValues
): DocumentSection | null {
  const blocks: DocumentBlock[] = [];

  if (v.temperamentTags.length > 0) {
    blocks.push({
      type: "tags",
      label: "Temperamento",
      tags: v.temperamentTags,
    });
  }

  if (v.valueTags.length > 0) {
    blocks.push({ type: "tags", label: "Valores", tags: v.valueTags });
  }

  if (arrayHasContent(v.flaws, ["text", "background"])) {
    const entries = v.flaws
      .filter((f) => nonEmpty(f.text) || nonEmpty(f.background))
      .map((f) => ({
        primary: f.text,
        detail: f.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: "Fraquezas", entries });
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
          PERSONALITY_FEAR_LEVEL_LABELS[f.level] ?? f.level ?? undefined,
        detail: f.background || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: "Medos", entries });
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
      blocks.push({ type: "entries", label: "Hábitos", entries });
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
      blocks.push({ type: "entries", label: "Peculiaridades", entries });
    }
  }

  return blocks.length > 0
    ? { id: "personality", title: "Personalidade e Traços", blocks }
    : null;
}

function buildGoalsSection(v: CharacterFormValues): DocumentSection | null {
  const blocks: DocumentBlock[] = [];

  if (arrayHasContent(v.shortTermGoals, ["meta", "description"])) {
    const entries = v.shortTermGoals
      .filter((g) => nonEmpty(g.meta) || nonEmpty(g.description))
      .map((g) => ({
        primary: g.meta,
        detail: g.description || undefined,
      }));
    if (entries.length > 0) {
      blocks.push({ type: "entries", label: "Metas de curto prazo", entries });
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
        label: "Objetivos de vida",
        entries,
      });
    }
  }

  return blocks.length > 0
    ? { id: "goals", title: "Objetivos e Motivações", blocks }
    : null;
}

function buildAppearanceSection(
  v: CharacterFormValues
): DocumentSection | null {
  const blocks: DocumentBlock[] = [];

  const fields: { label: string; key: keyof CharacterFormValues }[] = [
    { label: "Altura e porte", key: "heightDescription" },
    { label: "Marcas e cicatrizes escondidas", key: "hiddenMarksAndScars" },
    { label: "Primeira impressão", key: "firstImpression" },
    { label: "Voz e fala", key: "voiceAndSpeech" },
    { label: "Movimentos e maneirismos", key: "movementAndMannerisms" },
  ];

  for (const { label, key } of fields) {
    const val = v[key];
    if (typeof val === "string" && nonEmpty(val)) {
      blocks.push({ type: "text", label, value: val });
    }
  }

  return blocks.length > 0
    ? { id: "appearance", title: "Aparência e Comportamento", blocks }
    : null;
}

function buildFreeNotesSection(
  v: CharacterFormValues
): DocumentSection | null {
  if (!arrayHasContent(v.freeNotes, ["topic", "description"])) return null;

  const blocks: DocumentBlock[] = v.freeNotes
    .filter((n) => nonEmpty(n.topic) || nonEmpty(n.description))
    .map((n) => ({
      type: "note" as const,
      heading: n.topic || "Nota",
      body: n.description,
    }));

  return blocks.length > 0
    ? { id: "freeNotes", title: "Notas Livres", blocks }
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
 * Reuse this function in export features (M1-F11 Markdown, M1-F12 plain text, M1-F13 PDF) so the document
 * structure is defined in a single place.
 */
export function buildCharacterDocument(
  values: CharacterFormValues
): CharacterDocument {
  const header: DocumentHeader = {
    characterName: values.characterName,
    playerName: values.playerName,
    meta: [
      { label: "Idade", value: values.age },
      { label: "Raça", value: values.race },
      { label: "Classe", value: values.characterClass },
      { label: "Ocupação", value: values.occupation },
    ].filter((m) => nonEmpty(m.value)),
  };

  const builders = [
    buildOriginSection,
    buildPersonalitySection,
    buildGoalsSection,
    buildAppearanceSection,
    buildFreeNotesSection,
  ];

  const sections = builders
    .map((fn) => fn(values))
    .filter((s): s is DocumentSection => s !== null);

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
