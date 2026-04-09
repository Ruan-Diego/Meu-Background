import { describe, expect, it } from "vitest";

import type { CharacterDocument } from "@/lib/character-form/document-sections";
import { characterDocumentToMarkdown } from "@/lib/character-form/document-markdown";

const emptyDoc: CharacterDocument = {
  header: { characterName: "", playerName: "", meta: [] },
  sections: [],
  isEmpty: true,
};

describe("characterDocumentToMarkdown", () => {
  it("should render placeholder title when name is empty", () => {
    const md = characterDocumentToMarkdown(emptyDoc);
    expect(md).toContain("# Sem nome");
    expect(md.endsWith("\n")).toBe(true);
  });

  it("should escape asterisks in user text for inline safety", () => {
    const doc: CharacterDocument = {
      header: { characterName: "Star*Name", playerName: "", meta: [] },
      sections: [
        {
          id: "s1",
          title: "Section",
          blocks: [
            {
              type: "text",
              label: "Bio",
              value: "Uses *emphasis* literally",
            },
          ],
        },
      ],
      isEmpty: false,
    };
    const md = characterDocumentToMarkdown(doc);
    expect(md).toContain("\\*");
    expect(md).toContain("# Star\\*Name");
  });

  it("should sanitize markdown-like line starts in paragraphs", () => {
    const doc: CharacterDocument = {
      header: { characterName: "H", playerName: "", meta: [] },
      sections: [
        {
          id: "s1",
          title: "Notes",
          blocks: [
            {
              type: "text",
              label: "Story",
              value: "# not a heading\n- not a list",
            },
          ],
        },
      ],
      isEmpty: false,
    };
    const md = characterDocumentToMarkdown(doc);
    expect(md).toMatch(/\\# not a heading/);
    expect(md).toMatch(/\\- not a list/);
  });

  it("should render tags and entries blocks", () => {
    const doc: CharacterDocument = {
      header: { characterName: "D", playerName: "P", meta: [] },
      sections: [
        {
          id: "s1",
          title: "Traits",
          blocks: [
            { type: "tags", label: "Temperament", tags: ["A", "B"] },
            {
              type: "entries",
              label: "Events",
              entries: [
                { primary: "Fall", secondary: "age 5", detail: "Line one" },
              ],
            },
          ],
        },
      ],
      isEmpty: false,
    };
    const md = characterDocumentToMarkdown(doc);
    expect(md).toContain("## Traits");
    expect(md).toContain("**Temperament**");
    expect(md).toContain("- A");
    expect(md).toContain("**Fall**");
    expect(md).toContain("age 5");
  });

  it("should render note blocks as level-3 headings", () => {
    const doc: CharacterDocument = {
      header: { characterName: "E", playerName: "", meta: [] },
      sections: [
        {
          id: "s1",
          title: "Free",
          blocks: [{ type: "note", heading: "Side quest", body: "Details" }],
        },
      ],
      isEmpty: false,
    };
    const md = characterDocumentToMarkdown(doc);
    expect(md).toContain("### Side quest");
    expect(md).toContain("Details");
  });
});
