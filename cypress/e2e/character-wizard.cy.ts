const STEP_TITLES = [
  "Informações básicas",
  "Origem e histórico",
  "Personalidade e traços",
  "Objetivos e motivações",
  "Aparência e Comportamento",
  "Notas livres",
  "Exportação",
] as const;

describe("Character form wizard", () => {
  beforeEach(() => {
    // Land on a page without the wizard so the previous test's wizard unmount
    // flushes draft to localStorage *before* we clear storage for /criar.
    cy.visit("/");
    cy.visit("/criar", {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.sessionStorage.clear();
      },
    });
    // Wait for Zustand hydration + form reset to finish before interacting.
    cy.get("form[data-ready]", { timeout: 10000 }).should("exist");
  });

  it("should not advance from basic step without character name", () => {
    cy.get('[data-testid="wizard-step-title"]').contains("Informações básicas");
    cy.get('[data-testid="wizard-next"]').click();
    cy.get("#characterName-error").should("be.visible");
    cy.contains("Informe o nome do personagem");
    cy.get('[data-testid="wizard-step-title"]').contains("Informações básicas");
  });

  it("should keep basic fields when going next and back", () => {
    cy.get('[data-testid="character-name-input"]').clear().type("Back Nav Test");
    cy.get('[data-testid="character-name-input"]').should(
      "have.value",
      "Back Nav Test"
    );
    cy.get('[data-testid="character-name-input"]').focus().blur();
    cy.get('[data-testid="wizard-next"]').click();
    cy.get('[data-testid="wizard-step-title"]').should(
      "contain",
      STEP_TITLES[1]
    );
    cy.get('[data-testid="wizard-prev"]').click();
    cy.get('[data-testid="wizard-step-title"]').should(
      "contain",
      STEP_TITLES[0]
    );
    cy.get('[data-testid="character-name-input"]').should(
      "have.value",
      "Back Nav Test"
    );
  });

  it("should advance through all steps to export", () => {
    cy.get('[data-testid="character-name-input"]').clear().type("E2E Hero");
    cy.get('[data-testid="character-name-input"]').should("have.value", "E2E Hero");
    cy.get('[data-testid="character-name-input"]').focus().blur();
    for (let i = 0; i < 6; i += 1) {
      cy.get('[data-testid="wizard-next"]').click();
      cy.get('[data-testid="wizard-step-title"]').should(
        "contain",
        STEP_TITLES[i + 1]
      );
    }
    cy.contains("Quase lá — escolha como baixar").should("be.visible");
    cy.contains("button", "Baixar Markdown (.md)").should("be.visible");
  });
});
