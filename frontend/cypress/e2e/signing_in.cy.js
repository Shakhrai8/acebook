describe("Signing in", () => {
  beforeEach(() => {
    cy.tests_cleanup();
  });

  it("with valid credentials, shows posts", () => {
    cy.signup("someone@example.com", "password", "username");
    cy.login("someone@example.com", "password");
    cy.get(".create-post-container").should("be.visible");
    cy.get(".fas.fa-sign-out-alt").click();
    cy.contains("Yes").click();
  });

  it("with missing password, redirects to '/login'", () => {
    cy.visit("/");
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#submit").click();

    cy.get("#submit").should("be.visible");
  });

  it("with missing email, redirects to '/login'", () => {
    cy.visit("/");
    cy.get(".fas.fa-sign-in-alt").click();
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.get("#submit").should("be.visible");
  });
});
