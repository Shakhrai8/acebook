describe("Signing up", () => {
  it("with valid credentials, redirects to '/login'", () => {
    cy.visit("/");
    cy.contains("Sign Up").click();
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();

    cy.url().should("include", "/");
  });

  it("with missing password, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone@example.com");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });

  it("with missing email, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });
});