describe("Landing page", () => {
  beforeEach(() => {
    cy.visit("/pt-BR");
  });

  it("should show the hero title and primary CTA", () => {
    cy.contains("h1", "Histórias de personagem completas").should("be.visible");
    cy.contains("a", "Começar agora")
      .should("be.visible")
      .should("have.attr", "href", "/pt-BR/criar");
  });

  it("should navigate to /pt-BR/criar when clicking Começar agora", () => {
    cy.contains("a", "Começar agora").click();
    cy.location("pathname").should("eq", "/pt-BR/criar");
  });

  it("should show English hero on /en", () => {
    cy.visit("/en");
    cy.get("html").should("have.attr", "lang", "en");
    cy.contains("h1", "Complete character stories").should("be.visible");
  });

  it("should scroll to #como-funciona when clicking Como funciona", () => {
    cy.contains("a", "Como funciona")
      .should("have.attr", "href", "#como-funciona")
      .click();
    cy.get("#como-funciona").should("be.visible");
  });
});
