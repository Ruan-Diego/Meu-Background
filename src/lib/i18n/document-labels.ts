import type { Messages } from "@/lib/i18n/messages-loader";
import { getMessageValue } from "@/lib/i18n/format-message";
import type { PersonalityFearLevel } from "@/lib/character-form/personality-constants";
import { PERSONALITY_FEAR_LEVELS } from "@/lib/character-form/personality-constants";

export type DocumentBuildLabels = {
  headerMeta: {
    age: string;
    race: string;
    characterClass: string;
    occupation: string;
  };
  sections: {
    origin: {
      title: string;
      birthPlace: string;
      relatives: string;
      events: string;
      occupation: string;
    };
    personality: {
      title: string;
      temperament: string;
      values: string;
      flaws: string;
      fears: string;
      habits: string;
      quirks: string;
    };
    goals: {
      title: string;
      shortTerm: string;
      life: string;
    };
    appearance: {
      title: string;
      height: string;
      hiddenMarks: string;
      firstImpression: string;
      voice: string;
      movement: string;
    };
    freeNotes: { title: string };
  };
  defaults: {
    eventName: string;
    noteHeading: string;
    shapingAgeTemplate: string;
  };
  fearLevelLabels: Record<PersonalityFearLevel, string>;
};

export type DocumentSerializationLabels = {
  unnamedCharacter: string;
  /** Markdown line body, e.g. "Por {player}" (wrapped in italics by caller). */
  byPlayerMarkdown: string;
  /** Plain-text full line after title, e.g. "Por {player}" */
  byPlayerPlain: string;
  defaultNoteHeading: string;
};

export type PdfChromeLabels = {
  unnamedCharacter: string;
  /** Lowercase prefix before player name in PDF header, e.g. "por " */
  byPlayerPrefix: string;
  defaultNoteHeading: string;
  documentLanguage: string;
};

function req(m: Messages, path: string): string {
  const v = getMessageValue(m, path);
  if (v === undefined) throw new Error(`Missing message: ${path}`);
  return v;
}

export function buildDocumentLabels(messages: Messages): DocumentBuildLabels {
  const fearLevelLabels = {} as Record<PersonalityFearLevel, string>;
  for (const lvl of PERSONALITY_FEAR_LEVELS) {
    fearLevelLabels[lvl] = req(messages, `document.fearLevels.${lvl}`);
  }

  return {
    headerMeta: {
      age: req(messages, "document.headerMeta.age"),
      race: req(messages, "document.headerMeta.race"),
      characterClass: req(messages, "document.headerMeta.class"),
      occupation: req(messages, "document.headerMeta.occupation"),
    },
    sections: {
      origin: {
        title: req(messages, "document.sections.origin.title"),
        birthPlace: req(messages, "document.sections.origin.birthPlace"),
        relatives: req(messages, "document.sections.origin.relatives"),
        events: req(messages, "document.sections.origin.events"),
        occupation: req(messages, "document.sections.origin.occupation"),
      },
      personality: {
        title: req(messages, "document.sections.personality.title"),
        temperament: req(messages, "document.sections.personality.temperament"),
        values: req(messages, "document.sections.personality.values"),
        flaws: req(messages, "document.sections.personality.flaws"),
        fears: req(messages, "document.sections.personality.fears"),
        habits: req(messages, "document.sections.personality.habits"),
        quirks: req(messages, "document.sections.personality.quirks"),
      },
      goals: {
        title: req(messages, "document.sections.goals.title"),
        shortTerm: req(messages, "document.sections.goals.shortTerm"),
        life: req(messages, "document.sections.goals.life"),
      },
      appearance: {
        title: req(messages, "document.sections.appearance.title"),
        height: req(messages, "document.sections.appearance.height"),
        hiddenMarks: req(messages, "document.sections.appearance.hiddenMarks"),
        firstImpression: req(messages, "document.sections.appearance.firstImpression"),
        voice: req(messages, "document.sections.appearance.voice"),
        movement: req(messages, "document.sections.appearance.movement"),
      },
      freeNotes: {
        title: req(messages, "document.sections.freeNotes.title"),
      },
    },
    defaults: {
      eventName: req(messages, "document.defaults.eventName"),
      noteHeading: req(messages, "document.defaults.noteHeading"),
      shapingAgeTemplate: req(messages, "document.defaults.shapingAgeTemplate"),
    },
    fearLevelLabels,
  };
}

export function buildSerializationLabels(
  messages: Messages
): DocumentSerializationLabels {
  return {
    unnamedCharacter: req(messages, "document.serialization.unnamedCharacter"),
    byPlayerMarkdown: req(messages, "document.serialization.byPlayerMarkdown"),
    byPlayerPlain: req(messages, "document.serialization.byPlayerPlain"),
    defaultNoteHeading: req(messages, "document.serialization.defaultNoteHeading"),
  };
}

export function buildPdfChromeLabels(
  messages: Messages,
  locale: string
): PdfChromeLabels {
  return {
    unnamedCharacter: req(messages, "document.pdf.unnamedCharacter"),
    byPlayerPrefix: req(messages, "document.pdf.byPlayerPrefix"),
    defaultNoteHeading: req(messages, "document.pdf.defaultNoteHeading"),
    documentLanguage: locale,
  };
}
