describe("Landing page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show the hero title and primary CTA", () => {
    cy.contains("h1", "Histórias de personagem completas").should("be.visible");
    cy.contains("a", "Começar agora")
      .should("be.visible")
      .should("have.attr", "href", "/criar");
  });

  it("should navigate to /criar when clicking Começar agora", () => {
    cy.contains("a", "Começar agora").click();
    cy.location("pathname").should("eq", "/criar");
  });

  it("should scroll to #como-funciona when clicking Como funciona", () => {
    cy.contains("a", "Como funciona")
      .should("have.attr", "href", "#como-funciona")
      .click();
    cy.get("#como-funciona").should("be.visible");
  });
});
