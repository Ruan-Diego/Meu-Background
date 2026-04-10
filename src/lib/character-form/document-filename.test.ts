import { describe, expect, it } from "vitest";

import type { CharacterDocument } from "@/lib/character-form/document-sections";
import {
  characterDocumentMarkdownFilename,
  characterDocumentPdfFilename,
  characterDocumentPlainTextFilename,
  slugifyBasenameFromName,
} from "@/lib/character-form/document-filename";

function docWithName(name: string): CharacterDocument {
  return {
    header: { characterName: name, playerName: "", meta: [] },
    sections: [],
    isEmpty: false,
  };
}

describe("slugifyBasenameFromName", () => {
  it("should use personagem when name is empty", () => {
    expect(slugifyBasenameFromName("")).toBe("personagem");
  });

  it("should use personagem when name is whitespace only", () => {
    expect(slugifyBasenameFromName("   ")).toBe("personagem");
  });

  it("should slug ASCII names", () => {
    expect(slugifyBasenameFromName("Aragorn Son of Arathorn")).toBe(
      "aragorn-son-of-arathorn"
    );
  });

  it("should strip accents and lowercase", () => {
    expect(slugifyBasenameFromName("José da Silva")).toBe("jose-da-silva");
  });

  it("should replace special characters with hyphens", () => {
    expect(slugifyBasenameFromName("Hero #1 (beta)")).toBe("hero-1-beta");
  });

  it("should trim leading and trailing hyphens", () => {
    expect(slugifyBasenameFromName("---foo---")).toBe("foo");
  });
});

describe("characterDocument*Filename", () => {
  it("should append correct extensions from document header name", () => {
    const doc = docWithName("Test Hero");
    expect(characterDocumentMarkdownFilename(doc)).toBe("test-hero.md");
    expect(characterDocumentPlainTextFilename(doc)).toBe("test-hero.txt");
    expect(characterDocumentPdfFilename(doc)).toBe("test-hero.pdf");
  });
});
