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
    cy.visit("/pt-BR");
    cy.visit("/pt-BR/criar", {
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

  it("should scroll the progress region into view when clicking next", () => {
    cy.get('[data-testid="character-name-input"]').clear().type("Scroll Next");
    cy.get('[data-testid="character-name-input"]').blur();
    cy.scrollTo("bottom");
    cy.window().its("scrollY").should("be.greaterThan", 100);
    cy.get('[data-testid="wizard-next"]').click();
    cy.get('[data-testid="wizard-step-title"]').should(
      "contain",
      STEP_TITLES[1]
    );
    cy.get('[data-testid="wizard-progress-anchor"]').should(($el) => {
      const top = $el[0].getBoundingClientRect().top;
      expect(top, "progress near top below sticky header").to.be.within(0, 120);
    });
  });

  it("should scroll the progress region into view when clicking previous", () => {
    cy.get('[data-testid="character-name-input"]').clear().type("Scroll Prev");
    cy.get('[data-testid="character-name-input"]').blur();
    cy.get('[data-testid="wizard-next"]').click();
    cy.get('[data-testid="wizard-step-title"]').should(
      "contain",
      STEP_TITLES[1]
    );
    cy.scrollTo("bottom");
    cy.window().its("scrollY").should("be.greaterThan", 100);
    cy.get('[data-testid="wizard-prev"]').click();
    cy.get('[data-testid="wizard-step-title"]').should(
      "contain",
      STEP_TITLES[0]
    );
    cy.get('[data-testid="wizard-progress-anchor"]').should(($el) => {
      const top = $el[0].getBoundingClientRect().top;
      expect(top, "progress near top below sticky header").to.be.within(0, 120);
    });
  });

  it("should scroll the progress region into view when selecting a step in the rail", () => {
    cy.scrollTo("bottom");
    cy.window().its("scrollY").should("be.greaterThan", 100);
    cy.contains("button", "Personalidade e traços").click();
    cy.get('[data-testid="wizard-step-title"]').should(
      "contain",
      STEP_TITLES[2]
    );
    cy.get('[data-testid="wizard-progress-anchor"]').should(($el) => {
      const top = $el[0].getBoundingClientRect().top;
      expect(top, "progress near top below sticky header").to.be.within(0, 120);
    });
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

describe("Character form wizard (en)", () => {
  beforeEach(() => {
    cy.visit("/en");
    cy.visit("/en/criar", {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.sessionStorage.clear();
      },
    });
    cy.get("form[data-ready]", { timeout: 10000 }).should("exist");
  });

  it("should show English chrome and validation on the basic step", () => {
    cy.get("html").should("have.attr", "lang", "en");
    cy.get('[data-testid="wizard-step-title"]').contains("Basic information");
    cy.get('[data-testid="character-name-input"]').should("be.visible");
    cy.get('[data-testid="wizard-next"]').click();
    cy.get("#characterName-error").should("be.visible");
    cy.contains("Enter the character name");
  });
});
