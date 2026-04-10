describe("Auto-save draft", () => {
  beforeEach(() => {
    cy.visit("/pt-BR");
    cy.visit("/pt-BR/criar", {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.sessionStorage.clear();
      },
    });
    cy.get("form[data-ready]", { timeout: 10000 }).should("exist");
  });

  it("should restore character name after reload when draft was flushed", () => {
    const name = "Persisted PC";
    cy.get('[data-testid="character-name-input"]').clear().type(name);
    cy.window().then((win) => {
      win.dispatchEvent(new Event("pagehide"));
    });
    cy.reload();
    cy.get("form[data-ready]", { timeout: 10000 }).should("exist");
    cy.get('[data-testid="character-name-input"]').should("have.value", name);
  });
});
